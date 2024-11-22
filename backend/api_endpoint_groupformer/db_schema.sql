DROP TABLE IF EXISTS records;

CREATE TABLE records (
    id INTEGER PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    role TEXT NOT NULL
);