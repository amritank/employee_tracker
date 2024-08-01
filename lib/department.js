const pool = require("../lib/dbConn.js");
const inquirer = require('inquirer');

class Department {
    constructor() {
    }

    // select * from department
    getDepartments() {
        return new Promise((resolve, reject) => {
            pool.query("SELECT id, name FROM department", (err, { rows }) => {
                if (err) {
                    console.info(`Error while querying department table: ${err}`);
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    // return the dept id given the dept name and the dataset
    getDeptId(deptName, data) {
        for (let d of data) {
            if (d.name == deptName) {
                return d.id;
            }
        }
    }

    // add a new department
    addDepartment() {
        return new Promise((resolve, reject) => {
            inquirer
                .prompt([{
                    type: "input",
                    name: "departmentName",
                    message: "What is the name of the department?"
                }])
                .then((data) => {
                    pool.query(`INSERT into department(name) VALUES ($1)`, [data.departmentName], (err, { rows }) => {
                        if (err) {
                            console.info(`Error while querying department table: ${err}`);
                            reject(err);
                        }
                        resolve(rows);
                    });
                })
                .catch((err) => { console.log(err) });

        });
    }
}

module.exports = Department;