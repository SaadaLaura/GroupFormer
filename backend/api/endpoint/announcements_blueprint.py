from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect
from backend.api.utils.query_result_mapper import QueryResultMapper

announcements_bp = Blueprint('announcements', __name__)

@announcements_bp.route('/', methods=['GET'])
@swag_from('swagger/announcements/announcements.yaml')
def get_announcements():
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute("SELECT * FROM announcements").fetchall()
        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, rows, 'No announcements found')

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@announcements_bp.route('/<announcement_id>', methods=['GET'])
@swag_from('swagger/announcements/announcements_by_id.yaml')
def get_announcement(announcement_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        row = cursor.execute('SELECT * FROM announcements WHERE id_announcement = ?', (announcement_id,)).fetchone()
        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Announcement not found')

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@announcements_bp.route('/<announcement_id>/research', methods=['GET'])
@swag_from('swagger/announcements/announcements_research.yaml')
def get_announcement_search(announcement_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute('''
            SELECT name FROM skill
            JOIN searches ON skill.id_skill = searches.id_skill
            WHERE id_announcement = ?
            ''', (announcement_id,)).fetchall()

        connection.close()
        # TODO: vérifier l'id announcements d'abord
        return QueryResultMapper.map_into_list(rows, 'No skills found for this announcements')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@announcements_bp.route('/<announcement_id>/about', methods=['GET'])
@swag_from('swagger/announcements/announcements_about.yaml')
def get_announcement_about(announcement_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute('''
            SELECT name FROM subject
            JOIN is_about ON subject.id_subject = is_about.id_subject
            WHERE id_announcement = ?
            ''', (announcement_id,)).fetchall()

        connection.close()
        # TODO: vérifier l'id announcements d'abord
        return QueryResultMapper.map_into_list(rows, 'No subjects found for this announcements')

    except Exception as e:
        return jsonify({"error": str(e)}), 500