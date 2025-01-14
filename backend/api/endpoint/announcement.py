from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect
from backend.api.utils.query_result_mapper import QueryResultMapper

announcement_bp = Blueprint('announcement', __name__)

@announcement_bp.route('/', methods=['GET'])
@swag_from('swagger/announcement/announcement.yaml')
def get_announcements():
    try:
        connection = db_connect()
        cursor = connection.cursor()
        rows = cursor.execute("SELECT * FROM announcement").fetchall()
        connection.close()

        return QueryResultMapper.map_multiple_rows(cursor, rows, 'No announcements found')

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@announcement_bp.route('/<announcement_id>', methods=['GET'])
@swag_from('swagger/announcement/announcement_by_id.yaml')
def get_announcement(announcement_id):
    try:
        connection = db_connect()
        cursor = connection.cursor()
        row = cursor.execute('SELECT * FROM announcement WHERE id_announcement = ?', (announcement_id,)).fetchone()
        connection.close()

        return QueryResultMapper.map_single_row(cursor, row, 'Announcement not found')

    except Exception as e:
        return jsonify({'message': str(e)}), 500