from flask import Blueprint, jsonify, request

from backend.api.database import db
from backend.api.dtos.subject_dto import SubjectDTO
from backend.api.models import Subject
from backend.api.models.person import Role
from backend.api.utils.jwt_utils import token_required

subjects_bp = Blueprint('subjects', __name__)


# GET all subjects
@subjects_bp.route('', methods=['GET'])
@token_required()
def get_all_subjects():
    subjects = Subject.query.all()
    return jsonify([
        SubjectDTO.to_dict(subject) for subject in subjects
    ]), 200


# POST a subject
@subjects_bp.route('', methods=['POST'])
@token_required(Role.ADMIN.value)
def add_subject():
    subject = Subject(name=request.json.get('name'))
    db.session.add(subject)
    db.session.commit()

    return jsonify({
        'message': 'Subject added successfully'
    }), 201


# DELETE a subject
@subjects_bp.route('/<int:id_subject>', methods=['DELETE'])
@token_required(Role.ADMIN.value)
def delete_subject(id_subject):
    subject = Subject.query.get(id_subject)

    if not subject:
        return jsonify({'error': 'Subject not found'}), 404

    db.session.delete(subject)
    db.session.commit()

    return jsonify({'message': 'Subject deleted successfully'}), 200
