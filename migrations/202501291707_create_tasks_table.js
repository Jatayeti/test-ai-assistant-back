const mysql = require("mysql2/promise");
require("dotenv").config();

module.exports.up = async function () {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    await connection.query(`
        CREATE TABLE IF NOT EXISTS todos (
             id INT AUTO_INCREMENT PRIMARY KEY,
             title VARCHAR(255) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
    `);
    await connection.end();
};

module.exports.down = async function () {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    await connection.query("DROP TABLE IF EXISTS todos");
    await connection.end();
};
