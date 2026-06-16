"use server";

import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function createGithubRepoTable() {
    const query = await pool.query(`
    CREATE TABLE IF NOT EXISTS github_repo_analysis_data (
      id          SERIAL PRIMARY KEY,
      repo_url    TEXT,
      readme      TEXT,
      tree        TEXT,
      packageJson TEXT,
      insights    TEXT,
      languages   TEXT,
      analyzed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

    return query;
}

export async function insertDataInGithubAnalysisRepoData(
    parsedAnalysis: {
        repo_url: string;
        readme: string;
        tree: string;
        packageJson: string;
        insights: string;
        languages: string;
    }
) {
    const { repo_url, readme, tree, packageJson, insights, languages } = parsedAnalysis;

    // Check if table exists; create it only if it doesn't
    const tableCheck = await pool.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND   table_name   = 'github_repo_analysis_data'
        );
    `);

    if (!tableCheck.rows[0].exists) {
        await createGithubRepoTable();
    }

    const result = await pool.query(
        `INSERT INTO github_repo_analysis_data (repo_url, readme, tree, packageJson, insights, languages)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`,
        [repo_url, readme, tree, packageJson, insights, languages]
    );

    return result.rows[0];
}

export async function getAllAnalyses() {
    const result = await pool.query(`
        SELECT id, repo_url, analyzed_at
        FROM github_repo_analysis_data
        ORDER BY analyzed_at DESC;
    `);
    return result.rows;
}

export async function getAnalysisById(id: number) {
    const result = await pool.query(
        `SELECT * FROM github_repo_analysis_data WHERE id = $1;`,
        [id]
    );
    return result.rows[0] ?? null;
}