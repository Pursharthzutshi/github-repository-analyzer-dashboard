const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
pool.query('SELECT languages FROM github_repo_analysis_data LIMIT 1').then(res => {
    console.log("LANGUAGES:", res.rows[0]?.languages);
    pool.end();
}).catch(console.error);
