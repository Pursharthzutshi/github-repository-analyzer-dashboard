'use server';

import { vectorEmbeddingStore } from "../lib/rag/vector-store";
import { ConnectMCP } from "../mcp/connect-mcp"
import { saveGithubAnalysisRepoData } from "./store-repo-data";

export default async function githubRepoAnalysis(_prevState: any, formData: FormData) {

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

        const analyzeGithubRepoInsights = client.callTool({
            name: "analyze-github-repo-insights",
            arguments: {
                githubRepoUrl
            }
        }, undefined, { timeout: 120000 })

        const analyzeGithubRepoLanguages = client.callTool({
            name: "analyze-github-repo-languages",
            arguments: {
                githubRepoUrl
            }
        }, undefined, { timeout: 120000 })

        // Use allSettled so one failing tool doesn't kill the entire analysis
        const results = (await Promise.allSettled([
            analyzeGithubRepoReadmeAnalysis,
            analyzeGithubRepoTreeAnalysis,
            analyzeGithubRepoPackageJSONAnalysis,
            analyzeGithubRepoInsights,
            analyzeGithubRepoLanguages
        ])) as any[];

        // Safely extract text from each result (null if tool failed)
        const getText = (r: PromiseSettledResult<any>) =>
            r.status === "fulfilled" ? (r.value?.content?.[0]?.text || "") : "";

        if (results[0].status === "rejected" && results[1].status === "rejected") {
            // Core tools failed — surface the error
            throw new Error("Core analysis tools failed. Check console for details.");
        }

        const parsedAnalysis = {
            repo_url: githubRepoUrl,
            readme: getText(results[0]),
            tree: getText(results[1]),
            packageJson: getText(results[2]),
            insights: getText(results[3]),
            languages: getText(results[4]),
        };



        console.log("[Analysis] results:", results.map((r, i) => `${i}:${r.status}`).join(" "));

        const dataToSave = {
            state: "Success",
            message: "Loaded from local mock DB",
            data: JSON.stringify(parsedAnalysis),
            timestamp: Date.now()
        };

        await vectorEmbeddingStore(parsedAnalysis, githubRepoUrl)

        await saveGithubAnalysisRepoData(parsedAnalysis)

        // localStorage.setItem("latest_github_analysis", JSON.stringify(dataToSave));

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

