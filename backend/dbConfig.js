const mysql = require("mysql2");
const { config } = require("dotenv");

// Load environment variables from .env file
config();

// Create a connection pool
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true,
}).promise();

// Test connection function
async function testConnection() {
  try {
    await connection.query("SELECT 1");
    console.log("Connected to MYSQL");
  } catch (e) {
    console.error("Error connecting to the database:", e);
    throw e; // Rethrow the error after logging
  }
}

// Export the connection pool and test connection function
module.exports = { connection, testConnection };
