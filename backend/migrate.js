require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    const createTables = fs.readFileSync(
      path.join(__dirname, "migrations", "create_tables.sql"),
      "utf-8"
    );
    const seedData = fs.readFileSync(
      path.join(__dirname, "migrations", "seed.sql"),
      "utf-8"
    );

    console.log("👉 Creating tables...");
    await pool.query(createTables);

    console.log("👉 Seeding sample quiz...");
    await pool.query(seedData);

    console.log("✅ Migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await pool.end();
  }
}

runMigrations();
