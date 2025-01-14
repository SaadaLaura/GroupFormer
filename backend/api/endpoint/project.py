from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect
from backend.api.utils.query_result_mapper import QueryResultMapper

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['GET'])
@swag_from('swagger/project/project.yaml')
def get_projects():
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute("SELECT * FROM project").fetchall()
        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, rows, 'No projects found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_bp.route('/<project_id>', methods=['GET'])
@swag_from('swagger/project/project_by_id.yaml')
def get_project(project_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        row = cursor.execute('SELECT * FROM project WHERE id_project = ?', (project_id,)).fetchone()
        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Project not found')

    except Exception as e:
        return jsonify({"error": str(e)}), 500