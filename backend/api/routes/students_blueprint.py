from flasgger import swag_from
from flask import Blueprint, jsonify, g, request

from backend.api.database import db
from backend.api.dtos.project_dto import ProjectDTO
from backend.api.dtos.skill_dto import SkillDTO
from backend.api.dtos.subject_dto import SubjectDTO
from backend.api.dtos.user_dto import UserDTO
from backend.api.models.like import Like
from backend.api.models.master import Master
from backend.api.models.person import Person, Role
from backend.api.models.skill import Skill
from backend.api.models.subject import Subject
from backend.api.utils.jwt_utils import token_required

students_bp = Blueprint('students', __name__)


# Add skills to the logged-in student
@students_bp.route('/skills', methods=['POST'])
@token_required(Role.STUDENT.value)
def add_skills_to_student():
    student_id = g.user.id_user
    data = request.json

    if not isinstance(data, list) or not data:
        return jsonify({'error': 'A list of skill objects is required'}), 400

    added_skills = []
    for skill_data in data:
        skill_id = skill_data.get('id')
        skill_name = skill_data.get('name')

        skill = Skill.query.get(skill_id)
        if skill and skill.name == skill_name:
            if not Master.query.filter_by(id_user=student_id, id_skill=skill_id).first():
                db.session.add(Master(id_user=student_id, id_skill=skill_id))
                added_skills.append(skill_data)
        else:
            return jsonify({'error': 'Skill not found'}), 404

    db.session.commit()
    return jsonify({'message': 'Skills added successfully', 'added_skills': added_skills}), 201


# Add subjects to the logged-in student
@students_bp.route('/subjects', methods=['POST'])
@token_required(Role.STUDENT.value)
def add_subjects_to_student():
    student_id = g.user.id_user
    data = request.json

    if not isinstance(data, list) or not data:
        return jsonify({'error': 'A list of subject objects is required'}), 400

    added_subjects = []
    for subject_data in data:
        subject_id = subject_data.get('id')
        subject_name = subject_data.get('name')

        subject = Subject.query.get(subject_id)
        if subject and subject.name == subject_name:
            if not Like.query.filter_by(id_user=student_id, id_subject=subject_id).first():
                db.session.add(Like(id_user=student_id, id_subject=subject_id))
                added_subjects.append(subject_data)
        else:
            return jsonify({'error': 'Subject not found'}), 404

    db.session.commit()
    return jsonify({'message': 'Subjects added successfully', 'added_subjects': added_subjects}), 201


# DELETE logged-in student skills
@students_bp.route('/skills', methods=['DELETE'])
@token_required(Role.STUDENT.value)
def remove_skills_from_student():
    student_id = g.user.id_user
    data = request.json

    if not isinstance(data, list) or not data:
        return jsonify({'error': 'A list of skill objects is required'}), 400

    removed_skills = []
    for skill_data in data:
        skill_id = skill_data.get('id')
        skill_name = skill_data.get('name')

        mastery = Master.query.filter_by(id_user=student_id, id_skill=skill_id).first()
        if mastery:
            skill = Skill.query.get(skill_id)
            if skill and skill.name == skill_name:
                db.session.delete(mastery)
                removed_skills.append(skill_data)
            else:
                return jsonify({'error': 'Skill not found'}), 404

    db.session.commit()
    return jsonify({'message': 'Skills removed successfully', 'removed_skills': removed_skills}), 200


# DELETE logged-in student subjects
@students_bp.route('/subjects', methods=['DELETE'])
@token_required(Role.STUDENT.value)
def remove_subjects_from_student():
    student_id = g.user.id_user
    data = request.json

    if not isinstance(data, list) or not data:
        return jsonify({'error': 'A list of subject objects is required'}), 400

    removed_subjects = []
    for subject_data in data:
        subject_id = subject_data.get('id')
        subject_name = subject_data.get('name')

        like = Like.query.filter_by(id_user=student_id, id_subject=subject_id).first()
        if like:
            subject = Subject.query.get(subject_id)
            if subject and subject.name == subject_name:
                db.session.delete(like)
                removed_subjects.append(subject_data)
            else:
                return jsonify({'error': 'Subject not found'}), 404

    db.session.commit()
    return jsonify({'message': 'Subjects removed successfully', 'removed_subjects': removed_subjects}), 200


# GET all students
@students_bp.route('', methods=['GET'])
@swag_from('swagger/students/students.yaml')
@token_required()
def get_all_students():
    students = Person.query.filter_by(role=Role.STUDENT).all()
    return jsonify([
        UserDTO.student_to_dict(student) for student in students
    ]), 200


# GET a student by ID
@students_bp.route('/<int:student_id>', methods=['GET'])
@swag_from('swagger/students/students_by_id.yaml')
@token_required()
def get_student(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(UserDTO.student_to_dict(student)), 200


# GET skills of a student
@students_bp.route('/<int:student_id>/skills', methods=['GET'])
@swag_from('swagger/students/students_skills.yaml')
@token_required()
def get_student_skills(student_id):
    skills = db.session.query(Skill).join(Master).filter(Master.id_user == student_id).all()
    return jsonify([SkillDTO.to_dict(skill) for skill in skills]), 200


# GET subjects liked by a student
@students_bp.route('/<int:student_id>/subjects', methods=['GET'])
@swag_from('swagger/students/students_subjects.yaml')
@token_required()
def get_student_subjects(student_id):
    subjects = db.session.query(Subject).join(Like).filter(Like.id_user == student_id).all()
    return jsonify([SubjectDTO.to_dict(subject) for subject in subjects]), 200


# GET project of a student
@students_bp.route('/<int:student_id>/project', methods=['GET'])
@swag_from('swagger/students/students_project.yaml')
@token_required()
def get_student_project(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    if not student.id_project:
        return jsonify({'null': 'Student has no project'}), 200

    project = student.project
    return jsonify(ProjectDTO.to_dict(project)), 200
