import { storeRagDataEmbedding } from "@/app/(actions)/store-repo-data";
import { openrouterEmbeddings } from "../openrouter/openrouter";
import { MarkdownTextSplitter } from "@langchain/textsplitters"
import { embeddings } from "./embeddings";

export async function vectorEmbeddingStore(parsedAnalysis: any, githubRepoUrl) {

    try {

        const repoData = parsedAnalysis.readme
        console.log({ repoData });

        const markdownSplitter = new MarkdownTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        })

        const finalChunks = await markdownSplitter.createDocuments([parsedAnalysis.readme]);

        const embeddingsData = await embeddings(finalChunks)
        await storeRagDataEmbedding(embeddingsData, parsedAnalysis.repo_url)

    } catch (error) {
        console.log(error)
    }

}