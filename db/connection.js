const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Life2.0',
        database: 'employee_db'
    },
    console.log('Connected to the employee-db database.')
);

module.exports = db;