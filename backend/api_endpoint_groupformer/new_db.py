import sqlite3

con = sqlite3.connect('employees.db')

with open('db_schema.sql') as f:
    con.executescript(f.read())

cur = con.cursor()

cur.execute("INSERT INTO records (fname, lname, role) VALUES (?, ?, ?)",
            ('Aisha', 'Kumar', 'Product Manager')
            )

cur.execute("INSERT INTO records (fname, lname, role) VALUES (?, ?, ?)",
            ('Qian', 'Chen', 'Cloud Engineer')
            )

cur.execute("INSERT INTO records (fname, lname, role) VALUES (?, ?, ?)",
            ('Kamali', 'Keita', 'Data Analyst')
            )

con.commit()
con.close()