const role = require('express').Router();
const pool = require("../lib/dbConn.js");

role.get("/", (req, res) => {
    console.log("Processing GET role query.");
    pool.query("SELECT * FROM role", (err, { rows }) => {
        let statusCode;
        let response;
        if (err) {
            console.log(`Error while querying role table: ${err}`);
            statusCode = 500;
            response = {
                status: "FAILED",
                code: statusCode,
                message: "Failed to query role table.",
                body: err
            };
        } else {
            statusCode = 200;
            response = {
                status: "SUCESS",
                code: statusCode,
                message: "Sucessfully queried data from role table",
                body: rows
            };
            console.log(response);
            res.status(statusCode).json(response);
        }
    });
});


module.exports = role;