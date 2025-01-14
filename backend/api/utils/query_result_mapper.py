from flask import jsonify

class QueryResultMapper:
    @staticmethod
    def map_single_row(cursor, row, error_message):
        if row:
            column_names = [column[0] for column in cursor.description]
            data = dict(zip(column_names, row))
            return jsonify(data), 200
        else:
            return jsonify({"error": error_message}), 404

    @staticmethod
    def map_multiple_rows(cursor, rows, error_message):
        if rows:
            column_names = [column[0] for column in cursor.description]
            data_list = [dict(zip(column_names, row)) for row in rows]
            return jsonify(data_list), 200
        else:
            return jsonify({"error": error_message}), 404
