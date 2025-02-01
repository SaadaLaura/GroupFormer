from backend.api.routes import create_app
from flask_cors import CORS

# TODO: encodage de la base de donnée (éèà...)

if __name__ == "__main__": 
    app = create_app()
    CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})  # Permettre uniquement les requêtes provenant de http://localhost:4200
    app.run(debug=True, port=8000)