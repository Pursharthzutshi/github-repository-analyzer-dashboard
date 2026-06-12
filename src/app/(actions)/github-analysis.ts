import { ConnectMCP } from "../mcp/connect-mcp"

export default async function githubRepoAnalysis(prevState: any, formData: FormData) {

    const githubRepoUrl = formData.get("github-repo-url") as string;
    try {

        const client = await ConnectMCP()

        const analyzeGithubRepoReadmeAnalysis = client.callTool({
            name: "analyze-github-repo-readme",
            arguments: {
                githubRepoUrl
            }
        }, undefined, { timeout: 120000 })

        const analyzeGithubRepoTreeAnalysis = client.callTool({
            name: "analyze-github-repo-tree",
            arguments: {
                githubRepoUrl
            }
        }, undefined, { timeout: 120000 })

        const analyzeGithubRepoPackageJSONAnalysis = client.callTool({
            name: "analyze-github-repo-package-json",
            arguments: {
                githubRepoUrl
            }
        }, undefined, { timeout: 120000 })


        const result = await Promise.all([analyzeGithubRepoReadmeAnalysis, analyzeGithubRepoTreeAnalysis, analyzeGithubRepoPackageJSONAnalysis]).then((values) => {
            return values
        })

        console.log(result)

        // Parse the nested MCP responses into a clean object
        const parsedAnalysis = {
            readme: result[0]?.content?.[0]?.text || "",
            tree: result[1]?.content?.[0]?.text || "",
            packageJson: result[2]?.content?.[0]?.text || ""
        };

        const dataToSave = {
            state: "Success",
            message: "Loaded from local mock DB",
            data: JSON.stringify(parsedAnalysis),
            timestamp: Date.now()
        };
        localStorage.setItem("latest_github_analysis", JSON.stringify(dataToSave));

        return {
            state: "Success",
            message: "Github Repo Analyzed",
            data: JSON.stringify(parsedAnalysis)
        };
    } catch (error) {
        console.error("Analysis Error:", error);
        return {
            state: "Failed",
            message: "Github Repo Analysis Failed",
            data: null
        }
    }
}

export async function getLatestAnalysis() {
    try {
        const stored = localStorage.getItem("latest_github_analysis");
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                state: parsed.state,
                message: parsed.message,
                data: parsed.data
            };
        }
        return null;
    } catch (e) {
        console.error("Failed to load latest analysis", e);
        return null;
    }
}