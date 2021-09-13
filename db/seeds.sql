USE employee_db;

INSERT INTO department (department_name)
VALUES
    ('Engineering'),
    ('Legal'),
    ('Sales'),
    ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Software Engineer', 120000, 1),
    ('Lead Engineer', 150000, 1),
    ('Legal Team Lead', 250000, 2),
    ('Lawyer', 190000, 2),
    ('Accountant', 125000, 4),
    ('Sales Lead', 100000, 3),
    ('Salesperson', 80000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, 4),
    ('Jane', 'Doe', 2, NULL),
    ('Jeff', 'Smith', 3, NULL),
    ('Geoff', 'Johnson', 4, NULL),
    ('Michael', 'Smith', 5, NULL),
    ('Carol', 'Smith', 6, NULL),
    ('Alex', 'Samuels', 7, NULL);
