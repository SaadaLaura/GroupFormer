from flasgger import Swagger
from flask import Flask

from backend.api.endpoint.announcements_blueprint import announcements_bp
from backend.api.endpoint.projects_blueprint import projects_bp
from backend.api.endpoint.students_blueprint import students_bp

def create_app():
    app = Flask(__name__)
    Swagger(app)
    app.register_blueprint(students_bp, url_prefix='/students')
    app.register_blueprint(announcements_bp, url_prefix='/announcements')
    app.register_blueprint(projects_bp, url_prefix='/projects')
    return app