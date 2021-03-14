const { createConnection } = require('mysql');
const inquirer = require('inquirer');

const client = createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pass',
    database: 'employee_trackerdb',
});

const init = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role']
            }
        ]).then((answers) => {
            switch (answers.action) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all departments':
                    
                    break;
                case 'View all roles':
                    
                    break;

                case 'Add employees':
                    
                    break;
                case 'Add department':

                    break;
                case 'Add role':

                    break;
                case 'Update employee role':

                    break;
            }


        })

    client.end();
}

const viewEmployees = () => {
    const query = 'SELECT * FROM employee',
    (err,res) => {
        if(err) throw  err;
        res.forEach(( {id, first_name, last_name}) => {
            console.table(id, first_name,last_name);
        })
        console.log('---------------------------------');
    }
    init();

}

client.connect((err) => {
    if (err) throw err;
    console.log(`connected as id: ${client.threadId}`);
    init();

})