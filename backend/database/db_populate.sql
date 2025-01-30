INSERT INTO person VALUES
                       (684135, 'Guillaume', 'CLAVIER', 'guillaume.clavier@efrei.net', 'efrei2025', 'STUDENT', 0, 111),
                       (346845, 'Laura', 'SADAA', 'laura.saada@efrei.net', 'efrei2025', 'ADMIN', 0, null),
                       (795135, 'Clément', 'GUILLAUX', 'clement.guillaux@efrei.net', 'efrei2025', 'STUDENT', 0, null);

INSERT INTO skill VALUES
                      (1, 'backend'),
                      (2, 'frontend'),
                      (3, 'management');

INSERT INTO subject VALUES
                        (1, 'IT'),
                        (2, 'Data'),
                        (3, 'IA');

INSERT INTO project VALUES
    (111, 'GroupFormer', '05/02/2025', 'Aide à créer des groupes de projet', 6);

INSERT INTO master VALUES
                       (684135, 1),
                       (795135, 2);

INSERT INTO like VALUES
                      (684135, 1),
                      (795135, 2);

INSERT INTO announcement VALUES
    (1234, 'Recherche étudiant en Data', '03/12/2024', 111);

INSERT INTO search VALUES (2, 1234);

INSERT INTO is_about VALUES (1234, 2);