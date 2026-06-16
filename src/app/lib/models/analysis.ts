import { Pool } from "pg"

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})



export async function test() {
    const query = await pool.query("create table test (id serial primary key, name text);")

    return query
}