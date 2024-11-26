// This file establishes a connection between the application and the MySQL database.
// It enables our app to perform tasks like user authentication, data retrieval, and CRUD operations.

// Import the mysql2 package for connecting to the MySQL database
const mysql = require("mysql2");

// Import dotenv to load environment variables (like DB credentials) from the .env file
require("dotenv").config();

// Create a connection pool for efficient database interactions
// A pool maintains multiple connections, improving performance in concurrent requests.
const pool = mysql.createPool({
  host: process.env.DB_HOST,          // MySQL server hostname or IP address
  user: process.env.DB_USER,          // MySQL username
  password: process.env.DB_PASSWORD,  // MySQL password
  database: process.env.DB_NAME,      // Name of the database
  waitForConnections: true,           // Enables queueing of connection requests if all connections are busy
  connectionLimit: 10,                // Limits the number of active connections to 10
  queueLimit: 0,                      // Allows unlimited queued requests (0 means no limit)
});

// Convert the pool to use promise-based queries for easier asynchronous operations
const db = pool.promise();

// Export the database connection so it can be used in other parts of the app
module.exports = db;
