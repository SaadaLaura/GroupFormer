from flasgger import Swagger
from flask import Flask

from announcements_blueprint import announcements_bp
from backend.api.endpoint.projects_blueprint import projects_bp
from students_blueprint import students_bp

app = Flask(__name__)
swagger = Swagger(app)
app.register_blueprint(students_bp, url_prefix='/students')
app.register_blueprint(announcements_bp, url_prefix='/announcements')
app.register_blueprint(projects_bp, url_prefix='/projects')

if __name__== "__main__":
    app.run(debug=True, port=8000)