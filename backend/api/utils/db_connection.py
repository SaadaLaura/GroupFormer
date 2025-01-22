import os
import sqlite3

def db_connect():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
    db_path = os.path.join(base_dir, 'database', 'groupformer.db')

    connection = sqlite3.connect(db_path)
    return connection
