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



server.tool("analyze-github-repo-insights", "analyze the github repo basic stats and insights", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData, owner, repo } = await CallGithubRepo(githubRepoUrl);

    // Only use basic stats already available in repoData — no extra fetch needed
    const basicStats = JSON.stringify({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        license: repoData.license?.name || "None",
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        description: repoData.description,
        isForked: repoData.fork,
        visibility: repoData.visibility
    }, null, 2);

    const systemPrompt = "You are a Senior Software Engineer. Based on these basic repository stats (stars, forks, watchers, open issues, license, dates), write a concise summary of the repository's popularity, health, and activity level. Keep it brief and to the point.";
    const aiResponse = await AIprompt(repoData, owner, repo, basicStats, systemPrompt);

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }
})

server.tool("analyze-github-repo-languages", "analyze the tech stack and languages used in the github repo", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const { repoData, owner, repo } = await CallGithubRepo(githubRepoUrl);

    let languagesData = "";
    try {
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
        if (langRes.ok) {
            const languages = await langRes.json();
            // Calculate percentages
            const total = Object.values(languages).reduce((sum: any, v: any) => sum + v, 0) as number;
            const withPercentages = Object.entries(languages).map(([lang, bytes]: [string, any]) => ({
                language: lang,
                bytes,
                percentage: total > 0 ? ((bytes / total) * 100).toFixed(1) + "%" : "0%"
            }));
            languagesData = JSON.stringify(withPercentages, null, 2);
        }
    } catch (e) { console.error("Error fetching languages", e); }

    const systemPrompt = "You are a Senior Software Engineer. Based on the language breakdown data, describe the tech stack of this repository. List the main languages used, their approximate share, and what they likely power (frontend, backend, config, etc.). Be concise.";
    const aiResponse = await AIprompt(repoData, owner, repo, languagesData, systemPrompt);

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
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