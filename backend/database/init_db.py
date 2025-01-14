import sqlite3

connection = sqlite3.connect('groupformer.db')

with open('db_schema.sql') as f:
    connection.executescript(f.read())

with open('db_populate.sql') as p:
    connection.executescript(p.read())

cursor = connection.cursor()

# cur.execute("INSERT INTO person (id_user, firstname, lastname, email) VALUES (?, ?, ?, ?)",
#             (1, 'Bob', 'P', 'bob.p@efrei.net')
#             )

connection.commit()
connection.close()