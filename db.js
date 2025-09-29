const mysql = require("mysql2/promise");

// Create connection pool (enterprise standard)
const pool = mysql.createPool({
  host: "3.6.151.62",
  user: "remote_user",
  password: "password@123",
  database: "cabs", // <-- change to your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
