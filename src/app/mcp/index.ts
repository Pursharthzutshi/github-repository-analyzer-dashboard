import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod"
import AIprompt from "./ai-prompt";

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

server.tool("analyze-github-repo-package-json", "analyze the github repo readme", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return the tree stucture of repo"
    let packageJSON = "";
    const { aiResponse, owner, repo } = await AIprompt(githubRepoUrl, packageJSON, systemPrompt)

    try {
        const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
            headers: { "Accept": "application/vnd.github.raw" }
        });
        if (pkgRes.ok) {
            packageJSON = await pkgRes.text();
        }
    } catch (e) { console.error("Error fetching package.json", e); }

    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }
})

server.tool("analyze-github-repo-tree", "analyze the github repo readme", {
    githubRepoUrl: z.string()
}, async ({ githubRepoUrl }) => {
    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return the tree stucture of repo"
    let fileTree = "";
    const { aiResponse, owner, repo, defaultBranch } = await AIprompt(githubRepoUrl, fileTree, systemPrompt)
    try {
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
        if (treeRes.ok) {
            const treeData = await treeRes.json();
            if (treeData.tree) {
                fileTree = treeData.tree.map((item: any) => item.path).join("\n");
            }
        }
    } catch (e) { console.error("Error fetching tree", e); }

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
    let readme = "";
    const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return ONLY a valid Markdown: Name, README, Owner. Here Readme should be the analysis about the repo"
    const { aiResponse, owner, repo } = await AIprompt(githubRepoUrl, readme, systemPrompt)

    try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: { "Accept": "application/vnd.github.raw" }
        });

        if (readmeRes.ok) {
            readme = await readmeRes.text();
        }
    } catch (e) { console.error("Error fetching readme", e); }


    return {
        content: [
            {
                type: "text", text: aiResponse?.choices?.[0]?.message?.content || "No response generated"
            }
        ]
    }

})