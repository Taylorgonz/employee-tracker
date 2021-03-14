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
                choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Done']
            }
        ]).then((answers) => {
            switch (answers.action) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateEmployee();
                    break;
                case 'Done':
                    client.end();
                    break;
            }



        })


}

// query for viewing employees

const viewEmployees = () => {
    const query = client.query('SELECT * FROM employee',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
    console.log('---------------------------------');

}
// view all roles
const viewRoles = () => {
    const query = client.query('SELECT * FROM role',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
    console.log('---------------------------------');

}
// view all department
const viewRoles = () => {
    const query = client.query('SELECT * FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
    console.log('---------------------------------');

}

// query to add employee
const addEmployee = () => {
    client.query("SELECT * FROM role", (err, res) => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Employee\'s first name',
                    name: 'firstName',
                },
                {
                    type: 'input',
                    message: 'Employee\'s last name',
                    name: 'lastName',
                },
                {
                    type: 'rawlist',
                    message: 'Which employee would you like to update?',
                    name: 'choice',
                    choices() {
                        const choicesArray = [];
                        res.forEach(({ title }) => {
                            choicesArray.push(title);
                        })
                        return choicesArray
                    },
                },
            ]).then((answers) => {

                const query = client.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: answers.choice,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} updated!\n`)
                        init();
                    })
                console.log('---------------------------------');

            })
    });
};

// add role

const addRole = () => {
    client.query("SELECT * FROM department", (err, res) => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Title of this role',
                name: 'title',
            },
            {
                type: 'input',
                message: 'salary',
                name: 'lastName',
            },
            {
                type: 'list',
                message: 'Which employee would you like to update?',
                name: 'choice',
                choices() {
                    const choicesArray = [];
                    res.forEach(({ name, id }) => {
                        choicesArray.push({name, id});
                    })
                    return choicesArray
                },
            },
        ]).then((answers) => {

            const query = client.query(
                'INSERT INTO role SET ?',
                {
                    title: answers.title,
                    salary: answers.salary,
                    departmen_id: answers.choice,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} updated!\n`)
                    init();
                })
            console.log('---------------------------------');

        })
    })
};
// add department
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'name of Department',
                name: 'department',
            },
        ]).then((answers) => {
            const query = client.query(
                'INSERT INTO department SET ?',
                {
                    name: answers.department,

                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} updated!\n`)
                    init();
                })
            console.log('---------------------------------');

        })


}

const updateEmployee = () => {
    client.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    message: 'Which employee would you like to update?',
                    name: 'choice',
                    choices() {
                        const choicesArray = [];
                        res.forEach(({ first_name }) => {
                            choicesArray.push(first_name);
                        })
                        return choicesArray
                    },
                },

                {
                    type: 'input',
                    message: 'Employee\'s updated last name',
                    name: 'lastName',
                },

            ]).then((answers) => {
                let chosenItem;
                res.forEach((item) => {
                    if (item.first_name === answers.choice) {
                        chosenItem = item;
                    }
                })
                client.query(
                    'INSERT INTO employee SET ? WHERE ?',
                    {
                        last_name: answers.lastName,
                    },
                    {
                        first_name: chosenItem,
                    },
                    (err, res) => {
                        if (err)
                            throw err;
                        console.log(`${res.affectedRows} updated!\n`);
                        init();
                    });
                console.log('---------------------------------');

            });

    });

}

client.connect((err) => {
    if (err) throw err;
    console.log(`connected as id: ${client.threadId}`);
    init();

})