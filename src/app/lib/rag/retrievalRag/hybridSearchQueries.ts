import { pool } from "../../models/analysis";

export async function hybridSearchQueries(userRepoQueryEmbedding, userRepoQuery) {

    const vectorResults = await pool.query(`
        SELECT *, 1 - (embedding <=> $1) AS similarity_score
        FROM github_repo_analysis_chunk_vector_data
        ORDER BY embedding <=> $1
        LIMIT 5;
    `, [JSON.stringify(userRepoQueryEmbedding)]);

    const textResults = await pool.query(`
        SELECT *
        FROM github_repo_analysis_chunk_vector_data
        WHERE to_tsvector('english', chunk) @@ plainto_tsquery('english', $1)
        LIMIT 5;
`, [userRepoQuery]);


    return {
        vectorResults,
        textResults
    }

}