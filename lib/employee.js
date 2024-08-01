const inquirer = require("inquirer");
const pool = require("../lib/dbConn.js");
const Role = require("./role.js");

class Employee {
    constructor() {
        this.role = new Role();
    }

    getEmployees() {
        return new Promise((resolve, reject) => {
            const queryString = `
            select t1.id, t1.first_name, t1.last_name, role.title, department.name As department, role.salary, t2.first_name || ' ' || t2.last_name As manager 
            from employee t1
            JOIN role 
            ON role.id = t1.role_id
            JOIN department
            ON department.id = role.department_id
            LEFT JOIN employee t2 ON t2.id = t1.manager_id
            ORDER BY t1.id
            `

            pool.query(queryString, (err, { rows }) => {

                if (err) {
                    console.info(`Error while querying employee table: ${err}`);
                    reject(err);
                }
                resolve(rows);
            });
        });
    }


    // return employee id given an employee name as input string and employe data to search from
    getEmployeeId(eName, data) {
        // console.log("data inside method: ", data);
        for (let d of data) {
            if (d.first_name + " " + d.last_name == eName) {
                return d.id;
            }
        }
    }

    // insert new employee into the table
    addEmployee() {
        //get list of employee names to present as manager
        //get list of department names
        return new Promise((resolve, reject) => {
            // get all employes 
            this.getEmployees()
                .then((eData) => {
                    // pull out only the first and last names
                    const eNames = eData.map((d) => d.first_name + " " + d.last_name);

                    // pre-prend None to the array
                    eNames.unshift("None");
                    // console.log("Employee names: ", eNames); //TODO:Comment

                    // Now get all roles
                    this.role.getRoles()
                        .then((rData) => {
                            // pull out only the title into an array
                            const rNames = rData.map((d) => d.title);
                            // console.log("role names: ", rNames);

                            // prompt users for more questions
                            inquirer
                                .prompt([
                                    {
                                        type: "input",
                                        name: "fName",
                                        message: "What is the employee's first name?"
                                    },
                                    {
                                        type: "input",
                                        name: "lName",
                                        message: "What is the empoloyee's last name?"
                                    },
                                    {
                                        type: "list",
                                        name: "role",
                                        message: "What is the empoloyee's role?",
                                        choices: rNames
                                    },
                                    {
                                        type: "list",
                                        name: "manager",
                                        message: "Who is the employee's manager?",
                                        choices: eNames
                                    },

                                ])
                                .then((res) => {
                                    if (res.fName === "" || res.lName === "") {
                                        const err = "Employee first name or last name is empty. Erroring out";
                                        console.log(err);
                                        reject(err);

                                    }
                                    //console.log(res);//TODO:Comment
                                    const rId = this.role.getRoleId(res.role, rData)
                                    //console.log("Got back role id as: ", rId); //TODO:Comment
                                    let mgrId = null;
                                    if (res.manager !== 'None') {
                                        mgrId = this.getEmployeeId(res.manager, eData);
                                    }
                                    //console.log("setting mgrid: " + mgrId);//TODO:Comment
                                    pool.query(`INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [res.fName, res.lName, parseInt(rId), mgrId], (err, { rows }) => {
                                        if (err) {
                                            console.info(`Error while inserting into employee table: ${err}`);
                                            reject(err);
                                        }
                                        resolve(rows);
                                    });
                                });
                        });

                })
                .catch((err) => {
                    console.error("Error while adding employee: ", err);
                    reject(err);
                });
        });

    }

    updateEmployeeRole() {
        return new Promise((resolve, reject) => {
            this.getEmployees()
                .then((eData) => {
                    // pull out only the first and last names
                    const eNames = eData.map((d) => d.first_name + " " + d.last_name);

                    // pre-prend None to the array
                    eNames.unshift("None");

                    // get all roles
                    this.role.getRoles()
                        .then((rData) => {
                            // pull our role names 
                            const rNames = rData.map((d) => d.title);
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        name: "name",
                                        message: "Which employee's role would you like to update?",
                                        choices: eNames
                                    },
                                    {
                                        type: "list",
                                        name: "role",
                                        message: "Which role do you want to assign the selected employee?",
                                        choices: rNames
                                    }
                                ])
                                .then((res) => {
                                    const rId = this.role.getRoleId(res.role, rData);
                                    const eId = this.getEmployeeId(res.name, eData);
                                    pool.query(
                                        `UPDATE employee SET role_id=$1 where id=$2`,
                                        [rId, eId],
                                        (err, { rows }) => {
                                            if (err) {
                                                console.info(`Error while updating into employee table: ${err}`);
                                                reject(err);
                                            }
                                            resolve(rows);
                                        });

                                });
                        })
                })
                .catch((err) => console.log("Error while trying to update employee role"));
        });
    }
}

module.exports = Employee