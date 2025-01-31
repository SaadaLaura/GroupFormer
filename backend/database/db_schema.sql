DROP TABLE IF EXISTS skill;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS master;
DROP TABLE IF EXISTS search;
DROP TABLE IF EXISTS like;
DROP TABLE IF EXISTS is_about;

CREATE TABLE skill
(
    id_skill INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY(id_skill)
);

CREATE TABLE project
(
    id_project INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    deadline DATE,
    description VARCHAR(250) NOT NULL,
    size INT NOT NULL,
    PRIMARY KEY(id_project)
);

CREATE TABLE announcement
(
    id_announcement INT AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    publication DATE NOT NULL,
    id_project INT NOT NULL,
    PRIMARY KEY(id_announcement),
    FOREIGN KEY(id_project) REFERENCES project (id_project)
);

CREATE TABLE subject
(
    id_subject INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY(id_subject)
);

CREATE TABLE person
(
    id_user INT AUTO_INCREMENT,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    role VARCHAR(50) NOT NULL,
    first_connection BOOLEAN NOT NULL,
    id_project INT,
    PRIMARY KEY(id_user),
    FOREIGN KEY(id_project) REFERENCES project (id_project)

);

CREATE TABLE master(
    id_user INT,
    id_skill INT,
    PRIMARY KEY(id_user, id_skill),
    FOREIGN KEY(id_user) REFERENCES person (id_user),
    FOREIGN KEY(id_skill) REFERENCES skill (id_skill)
);

CREATE TABLE search(
    id_skill INT,
    id_announcement INT,
    PRIMARY KEY(id_skill, id_announcement),
    FOREIGN KEY(id_skill) REFERENCES skill (id_skill),
    FOREIGN KEY(id_announcement) REFERENCES announcement (id_announcement)
);

CREATE TABLE like(
    id_user INT,
    id_subject INT,
    PRIMARY KEY(id_user, id_subject),
    FOREIGN KEY(id_user) REFERENCES person (id_user),
    FOREIGN KEY(id_subject) REFERENCES subject (id_subject)
);

CREATE TABLE is_about(
    id_announcement INT,
    id_subject INT,
    PRIMARY KEY(id_announcement, id_subject),
    FOREIGN KEY(id_announcement) REFERENCES announcement (id_announcement),
    FOREIGN KEY(id_subject) REFERENCES subject (id_subject)
);