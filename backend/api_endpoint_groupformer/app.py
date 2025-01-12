import sqlite3
from flask import Flask, jsonify, request
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)

def db_connect():
    con = sqlite3.connect('../database/groupformer.db')
    return con

# @app.route('/')
# def default():
#     return '<h1>GroupFormer</h1>'

# TODO: encodage de la base de donnée (éèà...)

@app.route('/student', methods=['GET'])
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


# @app.route('/employee/', methods=['POST'])
# def add_emp():
#     con = db_connect()
#     cur = con.cursor()
#     new_emp = request.get_json()
#     id = new_emp['id']
#     fname = new_emp['fname']
#     lname = new_emp['lname']
#     role = new_emp['role']
#     cur.execute('INSERT INTO records (id, fname, lname, role) VALUES (?, ?, ?, ?)', (id, fname, lname, role))
#     con.commit()
#     con.close()
#     return new_emp
#
# @app.route('/employee/<empid>', methods=['PUT', 'PATCH'])
# def mod_emp(empid):
#     con = db_connect()
#     cur = con.cursor()
#     emp = cur.execute('SELECT * FROM records WHERE id = ?', (empid,)).fetchone()
#     fname = emp[1]
#     lname = emp[2]
#     role = emp[3]
#     update_emp = request.get_json()
#     if 'fname' in update_emp:
#         fname = update_emp['fname']
#     if 'lname' in update_emp:
#         lname = update_emp['lname']
#     if 'role' in update_emp:
#         role = update_emp['role']
#
#     cur.execute('UPDATE records SET fname = ?, lname = ?, role = ?'' WHERE id = ?', (fname, lname, role, empid))
#     con.commit()
#     con.close()
#     return f'Record {empid} was successfully updated!'
#
# @app.route('/employee/<empid>', methods=['DELETE'])
# def del_emp(empid):
#     con = db_connect()
#     cur = con.cursor()
#     cur.execute('DELETE FROM records WHERE id = ?', (empid,))
#     con.commit()
#     con.close()
#     return f'Record {empid} was successfully deleted!'
#
# @app.route('/employee/find', methods=['GET'])
# def find_emp():
#     con = db_connect()
#     cur = con.cursor()
#     if request.args.get('id'):
#         emp_id = request.args.get('id')
#         row = cur.execute('select * from records WHERE id = ?', (emp_id,)).fetchall()
#     elif request.args.get('fname'):
#         emp_fname = request.args.get('fname')
#         row = cur.execute('select * from records WHERE fname = ?', (emp_fname,)).fetchall()
#     elif request.args.get('lname'):
#         emp_lname = request.args.get('lname')
#         row = cur.execute('select * from records WHERE lname = ?', (emp_lname,)).fetchall()
#     elif request.args.get('role'):
#         emp_role = request.args.get('role')
#         row = cur.execute('select * from records WHERE role = ?', (emp_role,)).fetchall()
#     con.close()
#     return jsonify(row)


if __name__== "__main__":
    app.run(debug=True, port=8000)