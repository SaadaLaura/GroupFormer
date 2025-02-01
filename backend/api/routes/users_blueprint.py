import os

import pandas as pd
from email_validator import validate_email, EmailNotValidError
from flask import Blueprint, request, jsonify, g
from werkzeug.utils import secure_filename

from backend.api.config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER
from backend.api.database import db
from backend.api.dtos.user_dto import UserDTO
from backend.api.models import Person
from backend.api.models.person import Role
from backend.api.utils.jwt_utils import token_required, generate_token

users_bp = Blueprint('user', __name__)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Login route
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = Person.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'first_connection': user.first_connection
    }), 200


# Change password
@users_bp.route('/change-password', methods=['PUT'])
@token_required()
def change_password():
    data = request.json
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    user = g.user

    if not user.check_password(old_password):
        return jsonify({'error': 'Invalid old password'}), 400

    if new_password != confirm_password:
        return jsonify({'error': 'New passwords do not match'}), 400

    user.set_password(new_password)
    user.first_connection = False
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200


# Register route
@users_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role').lower()

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({'error': 'Invalid email'}), 400

    if role not in [r.value for r in Role]:
        return jsonify({'error': 'Invalid role'}), 400

    if Person.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409

    new_user = Person(
        firstname=firstname,
        lastname=lastname,
        email=email,
        role=Role(role),
        first_connection=False
    )
    new_user.set_password(password)  # Encrypt password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# Upload students from a file
@users_bp.route('/upload-students', methods=['POST'])
@token_required(Role.ADMIN.value)
def upload_students():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files.get('file')

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # Read the Excel file
    try:
        df = pd.read_excel(file_path)

        required_columns = {'firstname', 'lastname', 'email', 'password'}
        if not required_columns.issubset(df.columns):
            return jsonify({'error': 'Invalid file format. Missing required columns'}), 400

        students_created = []
        for _, row in df.iterrows():
            email = row['email']
            if Person.query.filter_by(email=email).first():
                continue  # Skip existing users

            student = Person(
                firstname=row['firstname'],
                lastname=row['lastname'],
                email=row['email'],
                role=Role.STUDENT,
                first_connection=True
            )
            student.set_password(str(row['password']))
            db.session.add(student)
            students_created.append(email)

        db.session.commit()
        return jsonify({'message': 'Students added successfully', 'count': len(students_created)}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET logged-in user information
@users_bp.route('/me', methods=['GET'])
@token_required()
def get_logged_in_user():
    user = g.user

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.role == Role.ADMIN.value:
        return jsonify(UserDTO.to_dict(user)), 200
    else:
        return jsonify(UserDTO.student_to_dict(user)), 200
