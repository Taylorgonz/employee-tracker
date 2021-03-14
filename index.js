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
                choices: ['View all employees', 'Add employee', 'Add department', 'Update employee manager', 'Update employee role']
            }
        ]).then((answers) => {
            switch (answers.action) {
                case 'View all employees':
                    
                    break;

                case 'Add employees':

                    break;
                case 'Add department':

                    break;
                case 'Update employeed manager':

                    break;
                case 'Update employee role':

                    break;
            }


        })

    client.end();
}

const viewEmployees = () => {
    const query = 'SELECT * FROM '
}

client.connect((err) => {
    if (err) throw err;
    console.log(`connected as id: ${client.threadId}`);
    init();

})