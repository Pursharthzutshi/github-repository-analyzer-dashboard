import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod"
import { openrouter } from "../lib/openrouter/openrouter";


export const server = new McpServer({
    name: "github-repo-analyzer-dashboard",
    version: "1.0.0",
})


server.resource("all-analysis", "analysis://all", async (uri) => {

    return {
        contents: [
            {
                uri: uri.href,
                mimeType: "application/json",
                text: JSON.stringify("text")
            }

        ]
    }
})

server.tool("analyze-github-repo", "analyze the github repo and return insights", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {

    let apiUrl = githubRepoUrl;
    try {
        const url = new URL(githubRepoUrl);
        if (url.hostname === "github.com") {
            const pathParts = url.pathname.split("/").filter(Boolean);
            if (pathParts.length >= 2) {
                apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
            }
        }
    } catch (e) {
        // ignore invalid URLs, it will just fallback to original
    }

    const fetchRepoData = await fetch(apiUrl)
    const repoData = await fetchRepoData.json()

    let readme = "No README found.";
    let fileTree = "No file tree found.";
    let packageJson = "No package.json found.";

    if (repoData.owner && repoData.name) {
        const owner = repoData.owner.login;
        const repo = repoData.name;
        const defaultBranch = repoData.default_branch || "main";

        // Fetch README
        try {
            const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
                headers: { "Accept": "application/vnd.github.raw" }
            });
            if (readmeRes.ok) {
                readme = await readmeRes.text();
            }
        } catch (e) { console.error("Error fetching readme", e); }

        // Fetch File Tree
        try {
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
            if (treeRes.ok) {
                const treeData = await treeRes.json();
                if (treeData.tree) {
                    fileTree = treeData.tree.map((item: any) => item.path).join("\n");
                }
            }
        } catch (e) { console.error("Error fetching tree", e); }

        // Fetch package.json
        try {
            const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
                headers: { "Accept": "application/vnd.github.raw" }
            });
            if (pkgRes.ok) {
                packageJson = await pkgRes.text();
            }
        } catch (e) { console.error("Error fetching package.json", e); }
    }

    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return ONLY a valid JSON object with the exact keys: summary (a detailed 3-paragraph string explaining the main purpose and features), architecture (a detailed multi-paragraph string explaining the file structure, patterns, and system design), techStack (array of strings), and onboardingSteps (array of strings). Do NOT be brief. Write extensive, detailed analysis for the summary and architecture fields.";

    const combinedData = `
    
    Repository Metadata:
    ${JSON.stringify({ name: repoData.name, description: repoData.description, stars: repoData.stargazers_count, default_branch: repoData.default_branch }, null, 2)}
    ---
    File Tree:
    ${fileTree}
    
    ---
    Dependencies (package.json):
    ${packageJson}
    
    ---
    README:
    ${readme}
    
    `;

    const aiResponse = await openrouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedData },
    ]);

    console.log(aiResponse);
    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }


})