import sqlite3
import os

def db_connect():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, '../../database/groupformer.db')
    connection = sqlite3.connect(db_path)
    return connection