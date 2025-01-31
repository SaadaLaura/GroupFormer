import sqlite3

connection = sqlite3.connect('groupformer.db')
connection.execute('PRAGMA encoding="UTF-8"')

with open('db_schema.sql', 'r', encoding='utf-8') as f:
    connection.executescript(f.read())

with open('db_populate.sql', 'r', encoding='utf-8') as p:
    connection.executescript(p.read())

connection.commit()
connection.close()