import { createGithubRepoTable, insertDataInGithubAnalysisRepoData, ragDataEmbeddingInsertion, deleteChunksByRepoUrl } from "../lib/models/analysis";

export async function githubRepoTable() {
    const createTableTest = await createGithubRepoTable()

    return {
        state: "success",
        message: "table is created successfully",
        data: {
            command: createTableTest.command,
            rowCount: createTableTest.rowCount
        }
    };

}

export async function saveGithubAnalysisRepoData(parsedAnalysis: any) {

    const insertRepoData = await insertDataInGithubAnalysisRepoData(parsedAnalysis);

    return {
        state: "success",
        message: "data is inserted successfully",
        data: insertRepoData
    };
}

export async function storeRagDataEmbedding(chunkData: any, githubRepoUrl: string) {

    const storeRagData = await ragDataEmbeddingInsertion(chunkData, githubRepoUrl);

    return {
        state: "success",
        message: "data is inserted successfully",
        data: storeRagData
    };
}

export async function clearRagDataForRepo(githubRepoUrl: string) {
    await deleteChunksByRepoUrl(githubRepoUrl);
    return { state: "success", message: "chunks cleared" };
}