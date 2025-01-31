from functools import wraps

import jwt
from flask import request, jsonify, g

from backend.api.config import SECRET_KEY
from backend.api.models import Person


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            user = Person.query.get(data['id'])
            if not user:
                return jsonify({'error': 'User not found'}), 404

            if user.first_connection and request.endpoint != "users.change_password":
                return jsonify({'error': 'Password change required before access'}), 403

            # Store user in `g` for access in routes
            g.user = user

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated
