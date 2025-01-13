from backend.api.db_connection import db_connect
from flask import Blueprint, jsonify

student = Blueprint('student', __name__)

@student.route('/', methods=['GET'])
def get_students():
    """
    Récupère la liste des étudiants.
    ---
    tags:
      - Student
    responses:
      200:
        description: Liste des étudiants.
        schema:
          type: array
          student:
            type: string
    """
    con = db_connect()
    cur = con.cursor()
    # TODO: crypté password
    rows = cur.execute('SELECT person.* FROM person JOIN student ON person.id_user = student.id_user').fetchall()
    con.close()
    return jsonify(rows)

@student.route('/<student_id>', methods=['GET'])
def get_student_data(student_id):
    """
    Récupère un étudiant en fonction de son id.
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
        description: Information de l'étudiant.
      404:
        description: Étudiant non trouvé.
    """
    try:
        con = db_connect()
        cur = con.cursor()
        # TODO: Use parameterized query to avoid SQL injection
        row = cur.execute('SELECT * FROM person WHERE id_user = ?', (student_id,)).fetchone()
        con.close()

        if row:
            return jsonify(row), 200
        else:
            return jsonify({"error": "Étudiant non trouvé"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student.route('/<student_id>/group', methods=['GET'])
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
        row = cur.execute('SELECT id_project FROM student \
            JOIN person ON student.id_user = person.id_user \
            WHERE person.id_user = ?', (student_id,)).fetchone()
        con.close()

        if row:
            return jsonify(row), 200
        else:
            return jsonify({"error": "Étudiant non trouvé"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500