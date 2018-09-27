USE hapivue;


DROP TABLE IF EXISTS grades;
CREATE TABLE grades (
    id INT NOT NULL auto_increment,
    name ENUM('Agent', 'Détective', 'Chef de la police'),
    CONSTRAINT grades_pk
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT NOT NULL auto_increment,
    grade_id INT NOT NULL,
    active BOOLEAN NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY(grade_id) REFERENCES grades(id)
);

INSERT INTO grades (`name`)
    VALUES ('Agent');

INSERT INTO grades (`name`)
    VALUES ('Détective');

INSERT INTO grades (`name`)
    VALUES ('Chef de la police');
