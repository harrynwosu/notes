const express = require("express");
const app = express();
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
require("express-async-errors");

logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info("successfully connected to MongoDB");
    })
    .catch((error) => {
        logger.error("Error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndopint);
app.use(middleware.errorHandler);

module.exports = app;


