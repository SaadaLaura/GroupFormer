from flasgger import swag_from
from flask import Blueprint, jsonify

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

students_bp = Blueprint('students', __name__)


# GET all students
@students_bp.route('', methods=['GET'])
@swag_from('swagger/students/students.yaml')
def get_all_students():
    students = Person.query.filter_by(role=Role.STUDENT).all()
    return jsonify([
        UserDTO.student_to_dict(student) for student in students
    ]), 200


# GET a student by ID
@students_bp.route('/<int:student_id>', methods=['GET'])
@swag_from('swagger/students/students_by_id.yaml')
def get_student(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(UserDTO.student_to_dict(student)), 200


# GET skills of a student
@students_bp.route('/<int:student_id>/skills', methods=['GET'])
@swag_from('swagger/students/students_skills.yaml')
def get_student_skills(student_id):
    skills = db.session.query(Skill).join(Master).filter(Master.id_user == student_id).all()
    return jsonify([SkillDTO.to_dict(skill) for skill in skills]), 200


# GET subjects liked by a student
@students_bp.route('/<int:student_id>/subjects', methods=['GET'])
@swag_from('swagger/students/students_subjects.yaml')
def get_student_subjects(student_id):
    subjects = db.session.query(Subject).join(Like).filter(Like.id_user == student_id).all()
    return jsonify([SubjectDTO.to_dict(subject) for subject in subjects]), 200


# GET project of a student
@students_bp.route('/<int:student_id>/project', methods=['GET'])
@swag_from('swagger/students/students_project.yaml')
def get_student_project(student_id):
    student = Person.query.filter_by(id_user=student_id, role=Role.STUDENT).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    if not student.id_project:
        return jsonify({'null': 'Student has no project'}), 200

    project = student.project
    return jsonify(ProjectDTO.to_dict(project)), 200
