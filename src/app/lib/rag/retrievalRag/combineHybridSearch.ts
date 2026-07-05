export function combineHybridSearch(vectorResults, textResults) {

    const hybridSearch = [...vectorResults.rows, ...textResults.rows];

    const hybridSearchCombined = Array.from(
        new Map(
            hybridSearch.map(item => [
                item.id.toString(),
                item
            ])
        ).values()
    );

    const context = hybridSearchCombined.map((c) => c.chunk).join("\n\n")

    const hasContext = context.trim().length > 0;

    return { context, hasContext, chunks: hybridSearchCombined }
}