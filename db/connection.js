// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Life2.0',
        database: 'employee_db'
    },
    console.log('connection to the employee-db database.')
);

modules.export = db;