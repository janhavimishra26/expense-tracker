const mysql = require('mysql2'); // Or require('mysql') depending on what you installed
require('dotenv').config();

// Create a connection pool instead of a single connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
   ssl: {
    rejectUnauthorized: false
}
});
// Verify the connection pool works on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("DB ERROR FULL:", err);
    } else {
        console.log("DB CONNECTED SUCCESSFULLY");
        connection.release();
    }
});
   
module.exports = db;
