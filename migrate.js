require("dotenv").config();
const path = require("path");
const mysql = require("mysql2/promise");
const { load } = require("migrate");

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function runMigrations(direction = "up") {
    try {
        load(
            {
                stateStore: path.join(__dirname, "migrations", ".migrate"),
                migrationsDirectory: path.join(__dirname, "migrations"),
            },
            async (err, set) => {
                if (err) throw err;
                if (direction === "up") {
                    set.up((err) => {
                        if (err) throw err;
                        console.log("✅ Migrations applied successfully.");
                    });
                } else {
                    set.down((err) => {
                        if (err) throw err;
                        console.log("⏪ Migrations rolled back successfully.");
                    });
                }
            }
        );
    } catch (error) {
        console.error("Migration error:", error);
    }
}

// Запуск миграций из терминала
if (require.main === module) {
    const direction = process.argv[2] || "up";
    runMigrations(direction);
}

module.exports = { connection, runMigrations };
