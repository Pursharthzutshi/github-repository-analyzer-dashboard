import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod"
import AIprompt from "./ai-prompt";
import { CallGithubRepo } from "./call-github-repo";

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

server.tool("analyze-github-repo-package-json", "analyze the github repo package json", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData, owner, repo } = await CallGithubRepo(githubRepoUrl);

    let packageJSON = "";
    try {
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
            headers: { "Accept": "application/vnd.github.raw" }
        });
        if (pkgRes.ok) {
            packageJSON = await pkgRes.text();
        }
    } catch (e) { console.error("Error fetching package.json", e); }

    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return the package json analysis of repo";
    const aiResponse = await AIprompt(repoData, owner, repo, packageJSON, systemPrompt);

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }
})



server.tool("analyze-github-repo-insights", "return basic github repo stats as JSON", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData } = await CallGithubRepo(githubRepoUrl);

    // Return raw stats as JSON — no AI needed for numbers
    const stats = {
        stars: repoData.stargazers_count ?? 0,
        forks: repoData.forks_count ?? 0,
        watchers: repoData.watchers_count ?? 0,
        openIssues: repoData.open_issues_count ?? 0,
        license: repoData.license?.name || "None",
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        description: repoData.description || "",
        visibility: repoData.visibility || "public"
    };

    return {
        content: [
            { type: "text", text: JSON.stringify(stats) }
        ]
    }
})

server.tool("analyze-github-repo-languages", "return language breakdown of the github repo as JSON", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { owner, repo } = await CallGithubRepo(githubRepoUrl);

    let result: any[] = [];
    try {
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
        if (langRes.ok) {
            const languages = await langRes.json();
            const total = Object.values(languages).reduce((sum: any, v: any) => sum + v, 0) as number;
            result = Object.entries(languages)
                .map(([lang, bytes]: [string, any]) => ({
                    language: lang,
                    bytes,
                    percentage: total > 0 ? parseFloat(((bytes / total) * 100).toFixed(1)) : 0
                }))
                .sort((a, b) => b.percentage - a.percentage);
        }
    } catch (e) { console.error("Error fetching languages", e); }

    return {
        content: [
            { type: "text", text: JSON.stringify(result) }
        ]
    }
})

server.tool("analyze-github-repo-tree", "analyze the github repo tree", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData, owner, repo, defaultBranch } = await CallGithubRepo(githubRepoUrl);

    let fileTree = "";
    try {
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
        if (treeRes.ok) {
            const treeData = await treeRes.json();
            if (treeData.tree) {
                fileTree = treeData.tree.map((item: any) => item.path).join("\n");
            }
        }
    } catch (e) { console.error("Error fetching tree", e); }

    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return the tree stucture of repo";
    const aiResponse = await AIprompt(repoData, owner, repo, fileTree, systemPrompt);

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }
})


server.tool("analyze-github-repo-readme", "analyze the github repo and return insights", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData, owner, repo } = await CallGithubRepo(githubRepoUrl);

    let readme = "";
    try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: { "Accept": "application/vnd.github.raw" }
        });

        if (readmeRes.ok) {
            readme = await readmeRes.text();
        }
    } catch (e) { console.error("Error fetching readme", e); }

    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return ONLY a valid Markdown: Name, README, Owner. Here Readme should be the analysis about the repo";
    const aiResponse = await AIprompt(repoData, owner, repo, readme, systemPrompt);

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }

})