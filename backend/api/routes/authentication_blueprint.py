import datetime

import jwt
from flask import Blueprint, request, jsonify

from backend.api.config import JWT_EXPIRATION_TIME_HOURS, SECRET_KEY
from backend.api.models import Person

authentication_bp = Blueprint('authentication', __name__)

# Generate JWT token
def generate_token(user):
    payload = {
        'id': user.id_user,
        'role': user.role.value,
        'exp': datetime.datetime.now() + datetime.timedelta(hours=JWT_EXPIRATION_TIME_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Login route
@authentication_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = Person.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({'token': token}), 200