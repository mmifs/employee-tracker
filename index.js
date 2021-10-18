const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const fs = require('fs');
const { exit } = require('process');
let rawdata = fs.readFileSync('.env')

const config = JSON.parse(rawdata);
if (config.host == null) {
    console.log('Error, missing host');
    exit(1);
}
if (config.user == null) {
    console.log('Error, missing user');
    exit(1);
}
if (config.password == null) {
    console.log('Error, missing password');
    exit(1);
}
if (config.database == null) {
    console.log('Error, missing database');
    exit(1);
}
const db = mysql.createConnection(
    config,
    console.log(`Connected database.`)
  );
  

runApp();

function runApp() {
    console.log('\n');
    viewAllEmployees();
};

function viewAllEmployees() {
    console.log('\n');
    const sql = `SELECT employee.employid, employee.first_name, employee.last_name,
    roles.title, department.department_name, r2.salary, employee.manager_id
    FROM employee
    INNER JOIN roles
    ON employee.role_id = roles.roleid
    INNER JOIN roles r2
    ON roles.salary = r2.salary
    INNER JOIN department
    ON roles.department_id = department.id
    ORDER BY employee.employid ASC`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].manager_id == null) {
                rows[i].manager = 'No manager';
            }
            else {
                rows[i].manager = rows[rows[i].manager_id - 1].first_name + ' ' + rows[rows[i].manager_id - 1].last_name;
            }
            delete rows[i].manager_id
        }
        console.table(rows);
        initMenu();
    })
};

function viewAllDepartments() {
    console.log('\n');
    const sql = `SELECT department.id, department.department_name
    FROM department
    ORDER BY department.id ASC`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        initMenu();
    })
};

function viewAllRoles() {
    console.log('\n');
    const sql = `SELECT roles.title, roles.roleid, department.department_name, roles.salary
    FROM roles
    INNER JOIN department
    ON roles.department_id = department.id 
    ORDER BY roles.roleid ASC`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        initMenu();
    })
};

function addDepartment() {
    console.log('\n');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'depName',
                message: 'What is the name of the new department?'
            }])
        .then(function({depName}) {
            const sql = `INSERT INTO department (department_name)
            VALUES
                ('${depName}')`;
                db.query(sql, (err, rows) => {
                    if(err) throw err;
                })
                initMenu();

        })
};

function addRole() {
    console.log('\n');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the new role?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: "Please enter the new role's salary, enter numbers only"
            }
        ])
        .then(function({roleName, roleSalary}) {
            const existingDep = `SELECT department.id, department.department_name FROM department`;
            db.query(existingDep, (err, rows) => {
                if(err) throw err;
                let getDeps = rows.map(({ department_name, id }) => ({ name: department_name, value: id}));
                inquirer
                    .prompt([
                        {
                            type:'list',
                            name: 'roleDepartment',
                            message: 'Choose a department for the new role',
                            choices: getDeps
                        }
                    ])
                    .then(function({roleDepartment}) {

                        const sql = `INSERT INTO roles (title, salary, department_id)
                        VALUES 
                        ('${roleName}', ${roleSalary}, ${roleDepartment})`;
                        db.query(sql, (err, foo) => {
                            if(err) throw err;
                            });
                        console.log(`${roleName} added to roles table`);
                        viewAllRoles();
                    })
            })
        })
}

function addEmp() {
    console.log('\n');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'empFirstName',
                message: "What is the new employee's first name?"
            },
            {
                type: 'input',
                name: 'empLastName',
                message: "What is the new employee's last name?"
            }
        ])
        .then(function({empFirstName, empLastName}) {
            const existingRoles = `SELECT roles.roleid, roles.title FROM roles`;
            db.query(existingRoles, (err, rows) => {
                if(err) throw err;
                let getRoles = rows.map(({ roleid, title }) => ({ name: title, value: roleid}));
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'roleChoice',
                            message: 'Choose a role for the new employee',
                            choices: getRoles
                        }
                    ])
                    .then(function({roleChoice}) {
                        console.log(roleChoice);
                        const existingEmps = `SELECT first_name, last_name, employid FROM employee`;
                        db.query(existingEmps, (err, rows2) => {
                            if(err) throw err;
                            let getEmps = rows2.map(({ first_name, last_name, employid }) => ({ name: first_name + ' ' + last_name, value: employid}));
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manChoice',
                                        message: 'Choose a manager for a new employee',
                                        choices: getEmps
                                    }
                                ])
                                .then(function({manChoice}) {
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES
                                        ('${empFirstName}', '${empLastName}', ${roleChoice}, ${manChoice})`;
                                        db.query(sql, (err, foo) => {
                                            if(err) throw err;
                                        });
                                        console.log(`${empFirstName} ${empLastName} added to employee table`);
                                        viewAllEmployees();
                                })
                        })
                    })
            })
        })
}


function updateRole() {
    console.log('\n');
    const existingEmps = `SELECT employid, first_name, last_name, role_id, roles.title
    FROM employee
    INNER JOIN roles
    ON roles.roleid = role_id
    ORDER BY employee.employid ASC`;
    db.query(existingEmps, (err, rows) => {
        if(err) throw err;
        let getEmps = rows.map(({ first_name, last_name, employid }) => ({ name: first_name + ' ' + last_name, value: employid}));
        let getRoles = rows.map(({ role_id, title }) => ({ name: title, value: role_id }));
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'empChoice',
                    message: "What employee's role is getting updated?",
                    choices: getEmps
                },
                {
                    type: 'list',
                    name: 'roleChoice',
                    message: 'What role would you like this employee to have?',
                    choices: getRoles
                }
            ])
            .then(function({empChoice, roleChoice}) {
                const sql = `UPDATE employee SET role_id = ${roleChoice} WHERE employid = ${empChoice}`;
                db.query(sql, (err, rows) => {
                    if (err) throw err;
                    console.log('Employee role updated');
                    viewAllEmployees();
                    initMenu();
                })

            })
    })
}


function initMenu() {
    console.log('\n')
    inquirer
        .prompt([
            {
                type: 'list',
                name:'mainMenu',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',  
                    'Add Department', 
                    'Add Role', 
                    'Add Employee', 
                    'Update Employee Role'
                ],
                message: 'What would you like to do?'
            }])
            .then(function({mainMenu}) {
                if (mainMenu === 'View All Departments') {
                    viewAllDepartments();
                } else if (mainMenu === 'View All Roles') {
                    viewAllRoles();
                } else if (mainMenu === 'View All Employees') {
                    viewAllEmployees();
                } else if (mainMenu === 'Add Department') {
                    addDepartment();
                } else if (mainMenu === 'Add Role') {
                    addRole();
                } else if (mainMenu === 'Add Employee') {
                    addEmp();
                } else {
                    updateRole();
                }
            });
};