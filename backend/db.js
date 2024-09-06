const mysql = require("mysql2");
const { config } = require("dotenv");
config();

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true
}).promise();

async function start() {
  try {
    // Run a test query to verify the connection
    await connection.query("SELECT 1");

    console.log("Connected to MYSQL");

    module.exports = connection;
    const app = require("./app");
    app.listen(process.env.PORT, () => {
      console.log("Server Listening on port " + process.env.PORT);
    });
  } catch (e) {
    console.error("Error connecting to the database:", e);
  }
}

start();
