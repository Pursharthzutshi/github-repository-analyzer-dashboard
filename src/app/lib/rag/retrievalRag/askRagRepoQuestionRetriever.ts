import { openrouter, openrouterEmbeddings } from "../../openrouter/openrouter";
import { pool } from "../../models/analysis";
import { hybridSearchQueries } from "./hybridSearchQueries";
import { combineHybridSearch } from "./combineHybridSearch";

export async function askRagRepoQuestionRetriever(userRepoQuery: string) {
    if (!userRepoQuery) {
        return {
            context: "",
            hasContext: false,
            chunks: []
        }
    }

    let userRepoQueryEmbedding: number[];
    try {
        userRepoQueryEmbedding = await openrouterEmbeddings(userRepoQuery);
    } catch (err: any) {
        console.error("[RAG] Embedding failed:", err?.message || err);
        return { context: "", hasContext: false, chunks: [] };
    }

    // Guard: if embedding call returned an error object instead of an array
    if (!Array.isArray(userRepoQueryEmbedding)) {
        console.error("[RAG] Embedding returned non-array:", userRepoQueryEmbedding);
        return { context: "", hasContext: false, chunks: [] };
    }

    const { vectorResults, textResults } = await hybridSearchQueries(userRepoQueryEmbedding, userRepoQuery)

    const { context, hasContext, chunks } = combineHybridSearch(vectorResults, textResults)

    // Strip the raw embedding vector from chunks — it's 1536 floats and not needed by the UI
    const safeChunks = chunks.map(({ embedding: _embedding, ...rest }: any) => rest);

    // Truncate context to avoid excessive token usage
    const truncatedContext = context.length > 3000
        ? context.slice(0, 3000) + "\n\n[...truncated...]"
        : context;

    return {
        context: truncatedContext,
        hasContext,
        chunks: safeChunks
    }
}