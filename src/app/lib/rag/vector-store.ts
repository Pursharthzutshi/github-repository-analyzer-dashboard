import { storeRagDataEmbedding, clearRagDataForRepo } from "@/app/(actions)/store-repo-data";
import { MarkdownTextSplitter } from "@langchain/textsplitters"
import { embeddings } from "./embeddings";

export async function vectorEmbeddingStore(parsedAnalysis: any, githubRepoUrl: string) {
    try {
        const markdownSplitter = new MarkdownTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });

        // Clear stale chunks for this repo before inserting fresh ones
        await clearRagDataForRepo(githubRepoUrl);

        // Build a combined corpus: readme + tree + packageJson
        // Each section is labeled so the model knows what it's reading
        const sections: { label: string; content: string }[] = [];

        if (parsedAnalysis.readme?.trim()) {
            sections.push({ label: "README", content: parsedAnalysis.readme });
        }
        if (parsedAnalysis.tree?.trim()) {
            sections.push({ label: "FILE TREE", content: parsedAnalysis.tree });
        }
        if (parsedAnalysis.packageJson?.trim()) {
            sections.push({ label: "PACKAGE.JSON ANALYSIS", content: parsedAnalysis.packageJson });
        }

        if (sections.length === 0) {
            console.warn("[VectorStore] No content to embed for", githubRepoUrl);
            return;
        }

        // Chunk and embed each section separately so chunks stay semantically coherent
        for (const section of sections) {
            const chunks = await markdownSplitter.createDocuments(
                [section.content],
                // Attach metadata so search results know the source
                [{ source: section.label, repo_url: githubRepoUrl }]
            );

            const embeddingsData = await embeddings(chunks);
            await storeRagDataEmbedding(embeddingsData, githubRepoUrl);
        }

        console.log(`[VectorStore] Embedded ${sections.length} sections for ${githubRepoUrl}`);
    } catch (error) {
        console.error("[VectorStore] Error:", error);
    }
}