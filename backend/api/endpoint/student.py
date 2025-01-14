from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect

student_bp = Blueprint('student', __name__)

@student_bp.route('/', methods=['GET'])
@swag_from('swagger/student/student.yaml')
def get_students():
    try:
        con = db_connect()
        cur = con.cursor()
        # TODO: crypté password
        rows = cur.execute('SELECT person.* FROM person JOIN student ON person.id_user = student.id_user').fetchall()

        if rows:
            # Récupérer les noms des colonnes de la table
            columns = [desc[0] for desc in cur.description]
            students = []
            for row in rows:
                data = dict(zip(columns, row))
                students.append(data)

            con.close()
            return jsonify(students), 200
        else:
            con.close()
            return jsonify({"error": "No students found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>', methods=['GET'])
@swag_from('swagger/student/student_by_id.yaml')
def get_student_data(student_id):
    try:
        con = db_connect()
        cur = con.cursor()
        # TODO: Use parameterized query to avoid SQL injection
        row = cur.execute('SELECT * FROM person WHERE id_user = ?', (student_id,)).fetchone()

        if row:
            columns = [desc[0] for desc in cur.description]
            data = dict(zip(columns, row))

            con.close()
            return jsonify(data), 200
        else:
            con.close()
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<student_id>/group', methods=['GET'])
@swag_from('swagger/student/student_group.yaml')
def get_student_group(student_id):
    """
    Récupère le groupe d'un étudiant en fonction de son id.
    Si l'étudiant n'a pas de groupe, retourne null
    ---
    tags:
      - Student
    parameters:
        - name: student_id
          in: path
          type: string
          required: true
          description: ID de l'étudiant
    responses:
      200:
        description: Groupe de l'étudiant.
      404:
        description: Étudiant non trouvé.
    """
    try:
        con = db_connect()
        cur = con.cursor()
        row = cur.execute('SELECT project.* FROM project \
            JOIN student ON project.id_project = student.id_project \
            WHERE student.id_user = ?', (student_id,)).fetchone()
        # con.close()

        if row:
            columns = [desc[0] for desc in cur.description]
            data = dict(zip(columns, row))
            con.close()
            return jsonify(data), 200
        else:
            con.close()
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500