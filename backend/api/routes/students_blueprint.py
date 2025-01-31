from flasgger import swag_from
from flask import Blueprint, jsonify, request, g

from backend.api.database import db
from backend.api.models.like import Like
from backend.api.models.master import Master
from backend.api.models.person import Person, Role
from backend.api.models.project import Project
from backend.api.models.skill import Skill
from backend.api.models.subject import Subject
from backend.api.utils.jwt_utils import token_required

students_bp = Blueprint('students', __name__)

# GET all students
@students_bp.route('', methods=['GET'])
@swag_from('swagger/students/students.yaml')
def get_all_students():
    students = Person.query.filter_by(role=Role.STUDENT).all()
    return jsonify([{
        'id': student.id_user,
        'firstname': student.firstname,
        'lastname': student.lastname,
        'email': student.email
    } for student in students]), 200

# GET a student by ID
@students_bp.route('/<int:student_id>', methods=['GET'])
@swag_from('swagger/students/students_by_id.yaml')
def get_student(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify({
        'id': student.id_user,
        'firstname': student.firstname,
        'lastname': student.lastname,
        'email': student.email
    }), 200

# GET skills of a student
@students_bp.route('/<int:student_id>/skills', methods=['GET'])
@swag_from('swagger/students/students_skills.yaml')
def get_student_skills(student_id):
    skills = db.session.query(Skill).join(Master).filter(Master.id_user == student_id).all()
    return jsonify([{
        'id': skill.id_skill,
        'name': skill.name
    } for skill in skills]), 200

# GET subjects liked by a student
@students_bp.route('/<int:student_id>/subjects', methods=['GET'])
@swag_from('swagger/students/students_subjects.yaml')
def get_student_subjects(student_id):
    subjects = db.session.query(Subject).join(Like).filter(Like.id_user == student_id).all()
    return jsonify([{
        'id': subject.id_subject,
        'name': subject.name
    } for subject in subjects]), 200

# GET project of a student
@students_bp.route('/<int:student_id>/project', methods=['GET'])
@swag_from('swagger/students/students_project.yaml')
def get_student_project(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    if not student.id_project:
        return jsonify({'null': 'Student has no project'}), 200

    project = Project.query.get(student.id_project)
    return jsonify({
        'id': project.id_project,
        'name': project.name,
        'description': project.description,
        'size': project.size,
        'deadline': project.deadline.strftime('%Y-%m-%d') if project.deadline else None
    }), 200

@students_bp.route('/me', methods=['GET'])
@token_required
def get_logged_in_student():
    student = Person.query.get(g.user_id)

    if not student:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': student.id_user,
        'firstname': student.firstname,
        'lastname': student.lastname,
        'email': student.email,
        'project': student.id_project
    }), 200