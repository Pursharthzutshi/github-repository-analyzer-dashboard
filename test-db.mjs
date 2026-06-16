import pg from "pg";

const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "123",
    database: "employee_db",
});

try {
    const res = await pool.query("SELECT NOW() AS current_time");
    console.log("✅ Connected! Server time:", res.rows[0].current_time);

    // Test creating a table
    await pool.query("CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY, name TEXT)");
    console.log("✅ Table 'test' created successfully");
} catch (err) {
    console.error("❌ Connection failed:", err.message);
} finally {
    await pool.end();
}
