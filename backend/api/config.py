import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
DB_PATH = os.path.join(BASE_DIR, 'database', 'groupformer.db')

SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}?charset=utf8"
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.getenv('SECRET_KEY', 'group_former_secret_key')
JWT_EXPIRATION_TIME_HOURS = 24