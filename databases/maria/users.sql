USE hapivue;


CREATE TABLE IF NOT EXISTS grades (
    id INT NOT NULL auto_increment,
    name ENUM('agent', 'detective', 'chef de la police'),
    CONSTRAINT grades_pk
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL auto_increment,
    grade_id INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT false,
    current_token VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(grade_id) REFERENCES grades(id),
    UNIQUE (username)
);
