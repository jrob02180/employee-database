const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer')
const db = require('./db/connection');


function init () {
    inquirer.prompt([
    {   type: 'list',
        name: 'questions',
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
    ]
        )
    }