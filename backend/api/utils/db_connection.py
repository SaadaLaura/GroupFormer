import sqlite3


def db_connect():
    # TODO: pas très bien de hardcode le chemin correspond à l'emplacement par rapport à où il est appelé
    con = sqlite3.connect('../../database/groupformer.db')
    return con