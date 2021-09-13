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
                console.log(rows[i].manager_id);
            }
            else {
                rows[i].manager = rows[rows[i].manager_id - 1].first_name + ' ' + rows[rows[i].manager_id - 1].last_name;
            }
        }
        //console.log(rows);
        console.table(rows);
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
                    'View All Employees', 
                    'View All Employees By Department', 
                    'View All Employees By Manager', 
                    'Add Employee', 
                    'Remove Employee', 
                    'Update Employee Role', 
                    'Update Employee Manager', 
                    'View All Roles', 
                    'Add Role', 
                    'Remove Role'
                ],
                message: 'What would you like to do?'
            }])
            .then(function({mainMenu}) {
                if (mainMenu === 'View All Employees') {
                    viewAllEmployees();
                } else if (mainMenu === 'View All Employees By Department') {
                    // show all employees with department data
                } else if (mainMenu === 'View All Employees By Manager') {
                    // show all employees with manager data
                } else if (mainMenu === 'Add Employee') {
                    // add employee to table
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