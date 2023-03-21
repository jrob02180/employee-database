const cTable = require('console.table');
const inquirer = require('inquirer')
const db = require('./db/connection');
db.connect(() => {
    init()
});

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'questions',
            message: 'What would you like to do?',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
        }
    ]
    )
        .then(response => {
            if (response.questions === "View all departments") {
                viewDept()
            }
            else if (response.questions === "View all roles") {
                viewRoles()
            }
            else if (response.questions === "View all employees") {
                viewEmployees()
            }
            else if (response.questions === "Add a department") {
                addDept()
            }
            else if (response.questions === "Add a role"){
                addRole()
            }
            else if (response.questions === "Add an employee"){
                addEmployee()
            }
            else if (response.questions === "Update an employee role"){
                updateRole()
            }
        })
}

function viewDept() {
    db.query("SELECT * FROM department", (err, data) => {
        console.table(data)
        init()
    })
}

function viewRoles() {
    db.query("SELECT roles.id, roles.title, department.dept_name, roles.salary FROM roles JOIN department ON roles.dept_id = department.id", (err, data) => {
        console.table(data)
        init()
    })
}

function viewEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON roles.id = employee.role_id JOIN department ON department.id = roles.dept_id LEFT JOIN employee manager ON employee.manager_id = manager.id ", (err, data) => {
        console.table(data)
        init()
    })
}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "newDept",
            message: "What is the name of the new deparment?"
        }
    ]).then(response => {
        db.query("INSERT INTO department (dept_name) VALUES(?)", [response.newDept], (error) => {
            if (error) throw error;
            console.log(`Created ${response.newDept} department successfully.`)
            viewDept()
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the name of the new role?"
        },
        {
            type: "input",
            name: "newSalary",
            message: "What is the salary of the new role?"
        },
        {
            type: "input",
            name: "deptName",
            message: "Which department ID does the role belong to?",
        }
    ]).then(response => {
        db.query("INSERT INTO roles (title, salary, dept_id) VALUES(?, ?, ?)", [response.newRole, response.newSalary, response.deptName], (error) => {
            if (error) throw error;
            console.log(`Added ${response.newRole} successfully.`)
            viewRoles()
        })
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the employees's role ID?"
        },
        {
            type: "input",
            name: "manager",
            message: "What is the manager's ID?",
        }
    ]
    ).then(response => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.firstName, response.lastName, response.role, response.manager], (error) => {
            if (error) throw error;
            console.log('New employee added successfully.')
            viewEmployees()
        })
    })
}

function updateRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "employeeRole",
            message: "Which employee's role do you want to update? (Please enter employee ID"
        },
        {
            type: "input",
            name: "newRole",
            message: "Which role do you want to assign the selected employee? (Please enter role ID"
        }
    ]).then(response => {
        db.query("UPDATE employee SET role_id = ? WHERE employee.id = ?)", [response.employeeRole, response.newRole], (error) => {
            if (error) throw error;
            console.log('Role has been updated succesfully.')
            viewRoles()
        })
    })
}