from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect
from backend.api.utils.query_result_mapper import QueryResultMapper

student_bp = Blueprint('student', __name__)

@student_bp.route('/', methods=['GET'])
@swag_from('swagger/student/student.yaml')
def get_students():
    try:
        connection = db_connect()
        cursor = connection.cursor()
        # TODO: crypté password
        rows = cursor.execute('''
            SELECT person.* FROM person
            JOIN student ON person.id_user = student.id_user
            ''').fetchall()
        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, rows, 'No students found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>', methods=['GET'])
@swag_from('swagger/student/student_by_id.yaml')
def get_student(student_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        # TODO: Use parameterized query to avoid SQL injection
        row = cursor.execute('SELECT * FROM person WHERE id_user = ?',(student_id,)).fetchone()
        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Student not found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>/skill', methods=['GET'])
@swag_from('swagger/student/student_skill.yaml')
def get_student_skill(student_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute('''
            SELECT name FROM skill
            JOIN master ON skill.id_skill = master.id_skill
            WHERE id_user = ?
            ''', (student_id,)).fetchall()

        connection.close()
        # TODO: vérifier l'id student d'abord
        return QueryResultMapper.map_into_list(rows, 'No skills found for the student')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>/subject', methods=['GET'])
@swag_from('swagger/student/student_subject.yaml')
def get_student_subject(student_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute('''
            SELECT name FROM subject
            JOIN likes ON subject.id_subject = likes.id_subject
            WHERE id_user = ?
            ''', (student_id,)).fetchall()

        connection.close()
        # TODO: vérifier l'id student d'abord
        return QueryResultMapper.map_into_list(rows, 'No subjects found for the student')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>/group', methods=['GET'])
@swag_from('swagger/student/student_project.yaml')
def get_student_group(student_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        # TODO: d'abord vérifier que l'étudiant à un groupe
        row = cursor.execute('''
            SELECT project.* FROM project
            JOIN student ON project.id_project = student.id_project
            WHERE student.id_user = ?
            ''', (student_id,)).fetchone()

        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Not found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500