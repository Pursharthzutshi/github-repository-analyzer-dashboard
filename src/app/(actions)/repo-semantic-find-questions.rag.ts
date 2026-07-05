'use server';

import { ConnectMCP } from "../mcp/connect-mcp";

export default async function repoSemanticFindQuestionsRAG(_prevState: any, formData: FormData) {
    const userRepoQuery = (formData.get("user-repo-query") || formData.get("query")) as string;
    
    if (!userRepoQuery) {
        return {
            state: "error",
            message: "Please provide a query",
            data: null,
            question: ""
        };
    }

    try {
        const client = await ConnectMCP();

        const searchResults = await client.callTool({
            name: "semantic-search-rag",
            arguments: {
                userRepoQuery
            }
        }, undefined, { timeout: 120000 });

        return {
            state: "Success",
            message: "Semantic search completed",
            data: JSON.stringify(searchResults),
            question: userRepoQuery
        };

    } catch (error: any) {
        console.error("[Semantic Search RAG] Error:", error);
        return {
            state: "error",
            message: error?.message || "Failed to perform semantic search",
            data: null,
            question: userRepoQuery
        };
    }
}