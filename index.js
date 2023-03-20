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
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(employee.first_name, ' ', employee_last name) AS manager FROM employee JOIN roles ON roles.id = employee.role_id JOIN department ON department.id = roles.dept_id JOIN employee ON employee.id = employee.manager_id ", (err, data) => {
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
            console.log('Department created successfully.')
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
            message: "Which department does the role belong to?",
        }
    ]).then(response => {
        db.query("INSERT INTO roles (title, salary, dept_id) VALUES(?, ?, ?)", [response.newRole, response.newSalary, response.deptName], err => {
            console.log('New role added successfully.')
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
            message: "What is the employees's role?"
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: ["None", "John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Allen"]
        }
    ]
    ).then(response => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.firstName, response.lastName, response.role, response.manager], err => {
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
            message: "Which employee's role do you want to update?"
        },
        {
            type: "input",
            name: "newRole",
            message: "Which role do you want to assign the selected employee?"
        }
    ]).then(response => {
        db.query("UPDATE employee SET role_id = ? WHERE employee.id = ?)", [response.employeeRole, response.newRole], err => {
            console.log('Role has been updated succesfully.')
            viewRoles()
        })
    })
}