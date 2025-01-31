from backend.api.routes import create_app

# TODO: encodage de la base de donnée (éèà...)

if __name__== "__main__":
    create_app().run(debug=True, port=8000)