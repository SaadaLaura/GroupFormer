from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from backend.api.config import SQLALCHEMY_DATABASE_URI

db = SQLAlchemy()

def init_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app
