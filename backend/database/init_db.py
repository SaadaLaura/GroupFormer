import sqlite3

con = sqlite3.connect('groupformer.db')

with open('db_schema.sql') as f:
    con.executescript(f.read())

with open('db_populate.sql') as p:
    con.executescript(p.read())

cur = con.cursor()

# cur.execute("INSERT INTO person (id_user, firstname, lastname, email) VALUES (?, ?, ?, ?)",
#             (1, 'Bob', 'P', 'bob.p@efrei.net')
#             )

con.commit()
con.close()