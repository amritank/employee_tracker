const { Pool } = require('pg');

const pool = new Pool({
    user: "test",
    password: "test",
    host: "localhost",
    database: "employee_tracker"
}, console.log("Creating PG connection instance"));


console.log("Connecting to the db");
pool.connect();

module.exports = pool;