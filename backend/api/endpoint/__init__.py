import sqlite3
from flask import Flask
from flasgger import Swagger
from student import student

app = Flask(__name__)
swagger = Swagger(app)
app.register_blueprint(student, url_prefix='/student')


if __name__== "__main__":
    app.run(debug=True, port=8000)