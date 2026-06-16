const { createGithubRepoTable, insertDataInGithubAnalysisRepoData } = require("./src/app/lib/models/analysis.ts");

async function test() {
    console.log("Testing create table...");
    await createGithubRepoTable();
    console.log("Table created.");

    console.log("Testing insert...");
    const res = await insertDataInGithubAnalysisRepoData({
        readme: "test readme",
        tree: "test tree",
        packageJson: "test package",
        insights: "test insights",
        languages: "test languages"
    });
    console.log("Inserted row:", res);
    process.exit(0);
}
test().catch(console.error);
