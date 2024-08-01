const pool = require("../lib/dbConn.js");
const inquirer = require('inquirer');
const Department = require("./department.js");

class Role {
    constructor() {
        this.dept = new Department();
    }

    // select * from role
    getRoles() {
        return new Promise((resolve, reject) => {
            const queryString = "SELECT role.id, title, department.name as department, salary FROM role JOIN department ON role.department_id = department.id";
            pool.query(queryString, (err, { rows }) => {
                if (err) {
                    console.log(`Error while querying role table: ${err}`);
                    reject(err)
                }
                resolve(rows);
            });
        });
    };

    // get id for a role given the role title
    getRoleId(roleName, data) {
        //  console.log("data inside method: ", data);
        for (let d of data) {
            if (d.title == roleName) {
                return d.id;
            }
        }
    }

    // Add a new role for a department into the db
    addRole() {
        return new Promise((resolve, reject) => {
            // Query for all departments
            this.dept.getDepartments()
                .then((depData) => {
                    // pull out only department name
                    const choices = depData.map((d) => d.name);
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                name: "roleName",
                                message: "What is the name of the role?"
                            },
                            {
                                type: "input",
                                name: "salary",
                                message: "What is the salary of the role?"
                            },
                            {
                                type: "list",
                                message: "which department doest the role below to?",
                                name: "departmentName",
                                choices: choices
                            },
                        ])
                        .then((data) => {
                            if (data.roleName === "") {
                                const err = "Role name is empty";
                                console.error(err);
                                reject(err)
                            }
                            //convert salary to float
                            const salary = parseFloat(data.salary);
                            // Get the dept id given the dept name and the dataset 
                            const deptId = this.dept.getDeptId(data.departmentName, depData);
                            pool.query(`INSERT into role(title, salary, department_id) VALUES ($1, $2, $3)`, [data.roleName, salary, parseInt(deptId)], (err, { rows }) => {
                                if (err) {
                                    console.info(`Error while inserting into role table: ${err}`);
                                    reject(err);
                                }
                                resolve(rows);
                            });
                        });
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
        });
    }


}

module.exports = Role