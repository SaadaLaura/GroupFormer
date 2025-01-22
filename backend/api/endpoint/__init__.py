from flasgger import Swagger
from flask import Flask, jsonify
from flask_cors import CORS

from backend.api.endpoint.announcements_blueprint import announcements_bp
from backend.api.endpoint.projects_blueprint import projects_bp
from backend.api.endpoint.students_blueprint import students_bp

app = Flask(__name__)
swagger = Swagger(app)
CORS(app)  

app.register_blueprint(students_bp, url_prefix='/student')
app.register_blueprint(announcements_bp, url_prefix='/announcement')
app.register_blueprint(projects_bp, url_prefix='/project')

if __name__== "__main__":
    app.run(debug=True, port=8000)