from flasgger import Swagger
from flask import Flask, jsonify
from flask_cors import CORS

from backend.api.database import db
from backend.api.routes.announcements_blueprint import announcements_bp
from backend.api.routes.projects_blueprint import projects_bp
from backend.api.routes.skills_blueprint import skills_bp
from backend.api.routes.students_blueprint import students_bp
from backend.api.routes.subjects_blueprint import subjects_bp
from backend.api.routes.users_blueprint import users_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.api.config')
    app.config['JSON_AS_ASCII'] = False

    db.init_app(app)
    Swagger(app)

    app.register_blueprint(students_bp, url_prefix='/students')
    app.register_blueprint(announcements_bp, url_prefix='/announcements')
    app.register_blueprint(projects_bp, url_prefix='/projects')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(skills_bp, url_prefix='/skills')
    app.register_blueprint(subjects_bp, url_prefix='/subjects')

    with app.app_context():
        # db.drop_all() # Need to be launched each time your reset the database
        db.create_all()

    return app
