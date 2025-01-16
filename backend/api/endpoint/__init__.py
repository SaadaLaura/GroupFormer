from flasgger import Swagger
from flask import Flask

from .announcement import announcement_bp
from .project import project_bp
from .student import student_bp


app = Flask(__name__)
swagger = Swagger(app)
app.register_blueprint(student_bp, url_prefix='/student')
app.register_blueprint(announcement_bp, url_prefix='/announcement')
app.register_blueprint(project_bp, url_prefix='/project')

if __name__== "__main__":
    app.run(debug=True, port=8000)