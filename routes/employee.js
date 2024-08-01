const employee = require('express').Router();
const pool = require("../lib/dbConn.js");

employee.get("/", (req, res) => {
    console.log("Processing GET employee query.");
    pool.query("SELECT * FROM employee", (err, { rows }) => {
        let statusCode;
        let response;
        if (err) {
            console.log(`Error while querying employee table: ${err}`);
            statusCode = 500;
            response = {
                status: "FAILED",
                code: statusCode,
                message: "Failed to query employee table.",
                body: err
            };
        } else {
            statusCode = 200;
            response = {
                status: "SUCESS",
                code: statusCode,
                message: "Sucessfully queried data from employee table",
                body: rows
            };
            console.log(response);
            res.status(statusCode).json(response);
        }
    });
});

module.exports = employee;
