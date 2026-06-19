user q 
emeddings (open router)
const search = pool.query(`

`

const keyword = pool.query(`

`

    const hybridSearch = [...vectorResults.rows, ...textResults.rows];



    const hybridSearchCombined = Array.from(
        new Map(
            hybridSearch.map(item => [
                item.id.toString(),
                item
            ])
        ).values()
    );

    hybridSearchCombined.map()