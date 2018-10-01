USE hapivue;


DROP TABLE IF EXISTS grades;
CREATE TABLE grades (
    id INT NOT NULL auto_increment,
    name ENUM('Agent', 'Détective', 'Chef de la police'),
    p_read BOOLEAN NOT NULL,
    p_add BOOLEAN NOT NULL,
    p_edit BOOLEAN NOT NULL,
    p_delete BOOLEAN NOT NULL,
    p_validate BOOLEAN NOT NULL,
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

INSERT INTO grades (`name`, `p_read`, `p_add`, `p_edit`, `p_delete`, `p_validate`)
    VALUES (
        'Agent',
        true,
        false,
        false,
        false,
        false
);

INSERT INTO grades (`name`, `p_read`, `p_add`, `p_edit`, `p_delete`, `p_validate`)
    VALUES (
        'Détective',
        true,
        true,
        true,
        false,
        false
);

INSERT INTO grades (`name`, `p_read`, `p_add`, `p_edit`, `p_delete`, `p_validate`)
    VALUES (
        'Chef de la police',
        true,
        true,
        true,
        true,
        true
);
