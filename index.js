require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const { PORT, DB_URI, DB_URI_LOCAL } = process.env;
const DB = require("./config/database");
const superAdminDetails = require("./config/superAdmin.config");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const isProd = app.get("env") === "production";

if (isProd) {
  app.use(logger("combined"));
} else {
  app.use(logger("dev"));
}

const DB_URL = isProd ? DB_URI : DB_URI_LOCAL;
const userRoutes = require("./routes/user.routes");
const error = require("./middlewares/errors");

new DB(superAdminDetails).connect(DB_URL);

app.use("/api/users", userRoutes);
app.use(error);

const address = isProd ? "https://bezomoni.herokuapp.com" : "http://localhost";

app.listen(PORT, () => console.log(`server running at ${address}:${PORT}`));
