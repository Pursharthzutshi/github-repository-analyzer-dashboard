import { formatWithOptions } from "util";
import { openrouter, openrouterEmbeddings } from "../../openrouter/openrouter";
import { pool } from "../../models/analysis";
import { hybridSearchQueries } from "./hybridSearchQueries";
import { combineHybridSearch } from "./combineHybridSearch";

export async function askRagRepoQuestionRetriever(userRepoQuery: string) {
    if (!userRepoQuery) {
        return {
            state: "error",
            message: "Please provide a question",
            data: null
        }
    }

    const userRepoQueryEmbedding = await openrouterEmbeddings(userRepoQuery);

    const { vectorResults, textResults } = await hybridSearchQueries(userRepoQueryEmbedding, userRepoQuery)

    const { context, hasContext, chunks } = combineHybridSearch(vectorResults, textResults)

    return {
        context, hasContext, chunks
    }
}