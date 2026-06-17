import { openrouterEmbeddings } from "../openrouter/openrouter";

export async function embeddings(finalChunks: any) {
    const embeddingsData = await Promise.all(
        finalChunks.map(async (chunk) => {
            const embeddingVector = await openrouterEmbeddings(chunk.pageContent);
            return {
                content: chunk.pageContent,
                metadata: chunk.metadata,
                embedding: embeddingVector
            };
        })
    );
    return embeddingsData;
}