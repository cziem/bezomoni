const mongoose = require("mongoose");

const options = {
  keepAlive: 300000,
  useCreateIndex: true,
  useNewUrlParser: true,
  connectTimeoutMS: 30000,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

class Database {
  constructor(superAdmin) {
    if (!superAdmin) {
      throw new Error(`Permission undefined in ${__dirname}`);
    }

    this.superAdmin = superAdmin;
  }

  connect(DB_URL) {
    mongoose
      .connect(DB_URL, options)
      .then(() => {
        console.log(`Successfully connected to database`);
      })
      .catch((err) => {
        console.log(`There was a database connection error ${err}`);
        process.exit(0);
      });

    const db = mongoose.connection;

    db.once("disconnected", () => {
      console.log(`Successfully disconnected from ${DB_URL}`);
    });

    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.log("Database connection closed due to app termination");
        process.exit(0);
      });
    });
  }
}

module.exports = Database;
