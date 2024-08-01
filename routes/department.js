const department = require('express').Router();
const pool = require("../lib/dbConn.js");

department.get("/", (req, res) => {
    console.log("Processing GET departments query.");
    pool.query("SELECT * FROM department", (err, { rows }) => {
        let statusCode;
        let response;
        if (err) {
            console.log(`Error while querying department table: ${err}`);
            statusCode = 500;
            response = {
                status: "FAILED",
                code: statusCode,
                message: "Failed to query department table.",
                body: err
            };
        } else {
            statusCode = 200;
            response = {
                status: "SUCESS",
                code: statusCode,
                message: "Sucessfully queried data from department table.",
                body: rows
            };
            console.log(response);
            res.status(statusCode).json(response);
        }
    });
});

module.exports = department;