const mysql = require('mysql2'); // Or require('mysql') depending on what you installed
require('dotenv').config();

// Create a connection pool instead of a single connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'expense_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify the connection pool works on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ SQL Connection failed permanently:", err.message);
    } else {
        console.log("⚡ Success! Node.js is connected to SQL Pool safely.");
        connection.release(); // Always release the test connection back to the pool
    }
});

module.exports = db;
