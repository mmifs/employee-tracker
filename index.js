const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_db'
    },
    console.log(`Connected database.`)
  );
  


/* 

TO DO:
1. create working menu
2. create schema file for sql
3. create seeds file for placeholder data
4. concatenate sql data with menu
    - show all data
    - change data with menu selections
    
*/

runApp();

function runApp() {
    //showTable();
    initMenu();
};

function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
    roles.title, department.department_name, r2.salary, employee.manager_id
    FROM employee
    INNER JOIN roles
    ON employee.role_id = roles.id
    INNER JOIN roles r2
    ON roles.salary = r2.salary
    INNER JOIN department
    ON roles.department_id = department.id
    ORDER BY employee.id ASC`;
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
    const sql = `SELECT roles.title, roles.id, department.department_name, roles.salary
    FROM roles
    INNER JOIN department
    ON roles.department_id = department.id
    ORDER BY roles.id ASC`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        initMenu();
    })
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'depName',
                message: 'What is the name of the new department?'
            }])
        .then(function({depName}) {
            console.log(depName);
            const sql = `INSERT INTO department (department_name)
            VALUES
                ('${depName}')`;
                db.query(sql, (err, rows) => {
                    if(err) throw err;
                })
                initMenu();

        })
};

function showTable() {

    // use console.table in conjunction with sql to display data

    // the following commented code confirms that console.table works

    /*console.table([
        {
          name: 'foo',
          age: 10
        }, {
          name: 'bar',
          age: 20
        }
      ]);*/
}

function initMenu() {
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
                    'Remove Employee', 
                    'Update Employee Role', 
                    'Update Employee Manager', 
                    'Add Role', 
                    'Remove Role'
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
                } else if (mainMenu === 'Remove Employee') {
                    // remove employee from table
                } else if (mainMenu === 'Update Employee Role') {
                    // change employee role
                } else if (mainMenu === 'Update Employee Manager') {
                    // change employee manager
                } else if (mainMenu === 'View All Roles') {
                    // show all roles only
                } else if (mainMenu === 'Add Role') {
                    // add new role, roles must concatenate with script in order for this to be fluid
                } else {
                    // remove role, must also concatenate
                }
            });
};