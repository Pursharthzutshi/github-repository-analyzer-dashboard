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