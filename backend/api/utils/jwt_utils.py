from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import request, jsonify, g

from backend.api.config import SECRET_KEY, JWT_EXPIRATION_TIME_HOURS
from backend.api.models import Person


# Generate JWT token
def generate_token(user):
    payload = {
        'id': user.id_user,
        'email': user.email,
        'role': user.role.value,
        'first_connection': user.first_connection,
        'exp': datetime.now() + timedelta(hours=JWT_EXPIRATION_TIME_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(required_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')

            if not token:
                return jsonify({'error': 'Token is missing!'}), 401

            try:
                data = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
                user = Person.query.get(data.get('id'))

                if required_roles and data.get('role') not in required_roles:
                    return jsonify({'error': 'Access forbidden: Insufficient permissions'}), 403

                if user.first_connection and request.endpoint != "users.change_password":
                    return jsonify({'error': 'Password change required before access'}), 403

                # Store user in `g` for access in routes
                g.user = user

            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator
