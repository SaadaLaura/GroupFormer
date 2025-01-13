from flasgger import swag_from
from flask import Blueprint, jsonify

from backend.api.utils.db_connection import db_connect

student = Blueprint('student', __name__)

@student.route('/', methods=['GET'])
@swag_from('swagger/student.yaml')
def get_students():
    # """
    # Récupère la liste des étudiants.
    # ---
    # tags:
    #   - Student
    # responses:
    #   200:
    #     description: Liste des étudiants.
    #     content:
    #       application/json:
    #         schema:
    #           type: array
    #           items:
    #             type: object
    #             properties:
    #               id_user:
    #                 type: integer
    #                 example: 684135
    #                 description: L'ID unique de l'étudiant.
    #               firstname:
    #                 type: string
    #                 example: Guillaume
    #                 description: Le prénom de l'étudiant.
    #               lastname:
    #                 type: string
    #                 example: CLAVIER
    #                 description: Le nom de famille de l'étudiant.
    #               email:
    #                 type: string
    #                 example: guillaume.clavier@efrei.net
    #                 description: L'adresse e-mail de l'étudiant.
    #               password:
    #                 type: string
    #                 example: efrei2025
    #                 description: Le mot de passe de l'étudiant (à crypter pour la production).
    #   404:
    #     description: Aucun étudiant trouvé.
    #     content:
    #       application/json:
    #         schema:
    #           type: object
    #           properties:
    #             error:
    #               type: string
    #               example: Étudiant non trouvé
    #               description: Message d'erreur indiquant qu'aucun étudiant n'a été trouvé.
    #   500:
    #     description: Erreur interne du serveur.
    #     content:
    #       application/json:
    #         schema:
    #           type: object
    #           properties:
    #             error:
    #               type: string
    #               example: Une erreur est survenue lors de la récupération des données.
    #               description: Message d'erreur générique en cas de problème serveur.
    # """
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