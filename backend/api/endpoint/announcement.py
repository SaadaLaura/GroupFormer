from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect

announcement_bp = Blueprint('announcement', __name__)

@announcement_bp.route('/', methods=['GET'])
@swag_from('swagger/announcement/announcement.yaml')
def get_announcement():
    try:
        con = db_connect()
        cur = con.cursor()
        rows = cur.execute("SELECT * FROM announcement").fetchall()

        if rows:
            columns = [desc[0] for desc in cur.description]
            announcements = []
            for row in rows:
                data = dict(zip(columns, row))
                announcements.append(data)

            con.close()
            return jsonify(announcements), 200
        else:
            con.close()
            return jsonify({'message': 'No announcements found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500