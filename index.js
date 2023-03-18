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
    db.query("SELECT * FROM role", (err, data) => {
        console.table(data)
        init()
    })
}

function viewEmployees() {
    db.query("SELECT * FROM employee", (err, data) => {
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
        db.query("INSERT INTO department (dept_name) VALUES(?)", [response.newDept], err => {
            viewDept()
            // add message: Added "new dept" to the database?
        })
    })
}

function addRole(){
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
            message: "Which department does the role belong to?"
        }
    ]).then(reponse => {
        db.query("INSERT INTO role(title, salary, dept_id)", [response.newRole, response.newSalary, response.deptName], err => {
            viewRoles()
        })
    })
}