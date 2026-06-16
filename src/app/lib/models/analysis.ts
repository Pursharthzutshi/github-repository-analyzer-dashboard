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
      id SERIAL PRIMARY KEY,
      readme TEXT,
      tree TEXT,
      packageJson TEXT,
      insights TEXT,
      languages TEXT
    );
  `);

    return query;
}

export async function insertDataInGithubAnalysisRepoData(
    parsedAnalysis: {
        readme: string;
        tree: string;
        packageJson: string;
        insights: string;
        languages: string;
    }
) {
    const { readme, tree, packageJson, insights, languages } = parsedAnalysis;

    const insertRepoDataQuery = `
    INSERT INTO github_repo_analysis_data (
      readme,
      tree,
      packageJson,
      insights,
      languages
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

    const result = await pool.query(insertRepoDataQuery, [
        readme,
        tree,
        packageJson,
        insights,
        languages,
    ]);

    return result.rows[0];
}