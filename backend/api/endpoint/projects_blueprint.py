from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect
from backend.api.utils.query_result_mapper import QueryResultMapper

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/', methods=['GET'])
@swag_from('swagger/projects/projects.yaml')
def get_projects():
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute("SELECT * FROM project").fetchall()
        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, rows, 'No projects found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects_bp.route('/<project_id>', methods=['GET'])
@swag_from('swagger/projects/projects_by_id.yaml')
def get_project(project_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        row = cursor.execute('SELECT * FROM project WHERE id_project = ?', (project_id,)).fetchone()
        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Project not found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects_bp.route('/<project_id>/announcements', methods=['GET'])
@swag_from('swagger/projects/projects_announcements.yaml')
def get_project_announcement(project_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        row = cursor.execute('''
            SELECT announcement.* FROM announcement
            JOIN project ON announcement.id_project = project.id_project
            WHERE project.id_project = ?
            ''', (project_id,)).fetchall()

        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, row, 'Project announcements not found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500