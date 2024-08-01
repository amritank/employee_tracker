const express = require('express');
const api = require("./routes/index.js");

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.json());
app.use("/api", api);

// start server
app.listen(PORT, () =>
    console.log(`App listening at ${PORT}`)
);