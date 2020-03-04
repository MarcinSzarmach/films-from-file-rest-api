if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const moviesRouter = require("./routes/movies");
const path = require('path');
var port = process.env.PORT || 8080;

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        process.env.FILE_FULL_PATH = path.join(
            __dirname,
            process.env.FILE_PATH
        );
        this.server.listen(port, () => console.log("server started"));
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use("/", moviesRouter);
    }
}

module.exports = new App();