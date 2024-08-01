const figlet = require('figlet');
const inquirer = require('inquirer');
const Department = require("./department.js");
const Employee = require("./employee.js");
const Role = require("./role.js");

class Cli {
    constructor() {
        this.department = new Department();
        this.employee = new Employee();
        this.role = new Role();
    }
    run() {
        this.displayBanner();
        // this.startApplication();

    }

    displayBanner() {
        // Generate banner
        figlet('Employee Tracker', (err, data) => {
            if (err) {
                console.log('Error while generation banner: ', err);
                return;
            }
            console.log(data);
            this.startApplication();
        });
    }

    startApplication() {
        inquirer
            .prompt([{
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: [
                    "Add Employee",
                    "Update Employee Role",
                    "View All Employees",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Quit"
                ]
            }])
            .then((data) => {
                switch (data.action) {
                    case "View All Departments":
                        this.department.getDepartments()
                            .then((data) => {
                                console.table(data);
                                this.startApplication()
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "View All Employees":
                        this.employee.getEmployees()
                            .then((data) => {
                                console.table(data);
                                this.startApplication();
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "View All Roles":
                        this.role.getRoles()
                            .then((data) => {
                                console.table(data);
                                this.startApplication();
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "Add Department":
                        this.department.addDepartment()
                            .then((data) => {
                                if (data.length > 0) {
                                    console.table(data);
                                }
                                this.startApplication()
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "Add Role":
                        this.role.addRole()
                            .then((data) => {
                                if (data.length > 0) {
                                    console.table(data);
                                }
                                this.startApplication()
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "Add Employee":
                        this.employee.addEmployee()
                            .then((data) => {
                                if (data.length > 0) {
                                    console.table(data);
                                }
                                this.startApplication()
                            })
                            .catch((err) => console.error(err));
                        break;
                    case "Update Employee Role":
                        this.employee.updateEmployeeRole()
                            .then((data) => {
                                if (data.length > 0) {
                                    console.table(data);
                                }
                                this.startApplication()
                            })
                            .catch((err) => console.error(err));
                    case "Quit":
                        console.log("Goodbye!");
                        process.exit(0);
                    default:
                        throw new Error("Invalid choice!");
                        break;
                };

            })
            .catch((err) => { console.log(err) });
    }
}


module.exports = Cli;
