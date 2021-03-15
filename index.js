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
                choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Delete employee', 'Done']
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
                case 'Delete employee':
                    deleteEmployee();
                    break;
                case 'Done':
                    client.end();
                    break;
            }



        })

}

// query for viewing employees

const viewEmployees = () => {
    const query = client.query("SELECT e.id, e.first_name, e.last_name,r.title, d.name department, salary, Concat(m.first_name, ' ',m.last_name) manager FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d on r.department_id = d.id LEFT JOIN employee m on m.id = e.manager_id ",
        (err, res) => {
            if (err) throw err;
            console.table(res)
            // res.forEach(({ id, first_name, last_name, title, department, salary, manager }) => {
            // console.table(`${id}  ${first_name}  ${last_name}  ${title}  ${department}  ${salary}  ${manager}`);

            // })
            init();
            console.log('---------------------------------');
        }
    )
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
const viewDepartments = () => {
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
    client.query("SELECT e.id id, r.id roleid, Concat(first_name, ' ', last_name) manager, title FROM employee e, role r ",
     (err, res) => {
         const rolesArray=[];
         const managerArray=['None'];
         res.forEach((item) =>{
             role = item.title;
             manager = item.manager;
             rolesArray.push(role);
             managerArray.push(manager);
         })
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
                    type: 'list',
                    message: 'What is the employees role?',
                    name: 'role',
                    choices: rolesArray,
                },
                {
                    type: 'list',
                    message: 'who is the employee\'s manager?',
                    name: 'manager',
                    choices: managerArray,
                },
            ]).then((answers) => {

                let roleItem;
                let managerItem;
                res.forEach((item) => {
                    if (item.title === answers.role) {
                        roleItem = item.roleid;
                    }
                    if (item.manager  == answers.manager) {
                        managerItem = item.id
                    }
                })

                const query = client.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: roleItem,
                        manager_id: managerItem
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
                    message: 'What is the salary of this role',
                    name: 'salary',
                },
                {
                    type: 'list',
                    message: 'Which department is this role in?',
                    name: 'choice',
                    choices() {
                        const choicesArray = [];
                        res.forEach(({ name }) => {
                            choicesArray.push({ name });
                        })
                        return choicesArray;
                    },
                },
            ]).then((answers) => {

                let chosenItem;
                res.forEach((item) => {
                    if (item.name === answers.choice) {
                        chosenItem = item.id;
                    }
                })
                console.log(chosenItem);
                const query = client.query(
                    'INSERT INTO role SET ?',
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: chosenItem,
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
    client.query("SELECT e.first_name, r.id, r.title FROM employee e, role r", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    name: 'firstName',
                    choices() {
                        const nameArray = [];
                        res.forEach(({ first_name }) => {
                            nameArray.push(first_name);
                        })
                        return nameArray;
                    },
                },

                {
                    type: 'list',
                    message: 'What is their new role?',
                    name: 'choice',
                    choices() {
                        const choicesArray = [];
                        res.forEach(({ title }) => {
                            choicesArray.push(title);
                        })
                        return choicesArray;
                    },
                },
            ]).then((answers) => {
                let chosenItem;
                res.forEach((item) => {
                    if (item.title === answers.choice) {
                        chosenItem = item.id;
                    }
                })
                console.log(chosenItem);
                const query = client.query(
                    'UPDATE employee SET ? WHERE ?',
                    [
                        {
                            role_id: chosenItem,
                        },
                        {
                            first_name: answers.firstName,
                        },
                    ],
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

const deleteEmployee= () => {
    client.query("SELECT first_name, Concat(first_name, ' ', last_name) FROM employee", (err, res) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to delete',
                    name: 'delete',
                    choices() {
                        const nameArray = [];
                        res.forEach(({ manager}) => {
                            nameArray.push(manager);
                        })
                        return nameArray;
                    },
                },

            ]).then((answers) => {
                let chosenItem;
                res.forEach((item) => {
                    if (item.manager === answers.delete) {
                        chosenItem = item.first_name;
                    }
                })
                console.log(chosenItem);
                const query = client.query(
                    'Delete FROM employee WHERE ?',
                    [
                        {
                            first_name: chosenItem,
                        },
                    ],
                    (err, res) => {
                        if (err)
                            throw err;
                        console.log(`${res.affectedRows} deleted!\n`);
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