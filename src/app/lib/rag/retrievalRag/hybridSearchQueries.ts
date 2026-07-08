import { pool } from "../../models/analysis";

export async function hybridSearchQueries(userRepoQueryEmbedding: number[], userRepoQuery: string) {

    const latestRepoResult = await pool.query(`
        SELECT repo_url FROM github_repo_analysis_data
        ORDER BY analyzed_at DESC
        LIMIT 1;
    `);
    const latestRepoUrl = latestRepoResult.rows[0]?.repo_url;

    const repoFilter = latestRepoUrl ? `AND repo_url = $2` : "";
    const vectorParams = latestRepoUrl
        ? [JSON.stringify(userRepoQueryEmbedding), latestRepoUrl]
        : [JSON.stringify(userRepoQueryEmbedding)];
    const textParams = latestRepoUrl
        ? [userRepoQuery, latestRepoUrl]
        : [userRepoQuery];

    const vectorResults = await pool.query(`
        SELECT *, 1 - (embedding <=> $1) AS similarity_score
        FROM github_repo_analysis_chunk_vector_data
        WHERE 1=1 ${repoFilter}
        ORDER BY embedding <=> $1
        LIMIT 3;
    `, vectorParams);

    const textResults = await pool.query(`
        SELECT *
        FROM github_repo_analysis_chunk_vector_data
        WHERE to_tsvector('english', chunk) @@ plainto_tsquery('english', $1)
        ${repoFilter ? `AND repo_url = $2` : ""}
        LIMIT 3;
    `, textParams);

    return {
        vectorResults,
        textResults
    }
}