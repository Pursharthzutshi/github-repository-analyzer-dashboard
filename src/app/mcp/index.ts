import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod"
import AIprompt from "./ai-prompt";
import { CallGithubRepo } from "./call-github-repo";
import { askRagRepoQuestionRetriever } from "../lib/rag/retrievalRag/askRagRepoQuestionRetriever";
import { openrouter } from "../lib/openrouter/openrouter";

/**
 * Registers all MCP tools onto the provided server instance.
 * Called once per request from ConnectMCP() with a fresh McpServer.
 * This avoids the "Server already started" error when reusing a singleton
 * across multiple requests (especially on Vercel serverless).
 */
export function registerMcpTools(server: McpServer) {

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


server.tool("semantic-search-rag", "Do a thorough semantic search", {
    userRepoQuery: z.string(),
}, async ({ userRepoQuery }) => {
    try {
        const { context, hasContext, chunks } = await askRagRepoQuestionRetriever(userRepoQuery);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ context, hasContext, chunks })
                }
            ]
        };
    } catch (err: any) {
        console.error("[semantic-search-rag] Error:", err?.message || err);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ context: "", hasContext: false, chunks: [], error: err?.message || "Search failed" })
                }
            ]
        };
    }
})

server.tool("call-github-ask-repo-questions", "give answer to the questions asked by user about repo", {
    userRepoQuery: z.string(),
}, async ({ userRepoQuery }) => {

    const { context, hasContext } = await askRagRepoQuestionRetriever(userRepoQuery)

    // Truncate context to avoid excessive token usage (~3000 chars ≈ ~750 tokens)
    const truncatedContext = context.length > 3000
        ? context.slice(0, 3000) + "\n\n[...context truncated for brevity...]"
        : context;

    const finalPrompt = hasContext
        ? [
            `You are an expert AI assistant designed to analyze GitHub repositories and answer developer questions about the codebase.`,
            ``,
            `You have been given some code snippets, README excerpts, or repository content below that was retrieved as potentially relevant to the user's question.`,
            ``,
            `**Your job:**`,
            `1. First, decide if the retrieved codebase context DIRECTLY and SPECIFICALLY answers the user's question.`,
            `2. If YES — answer the question using the provided context and explicitly cite the file names or functions if possible.`,
            `3. If NO (the context is only loosely related, tangential, or off-topic) — ignore the context entirely and answer from your own general programming knowledge. Also gently mention that the exact code for this wasn't found in the retrieved repository chunks.`,
            ``,
            `Do NOT force the repository context into your answer if it doesn't directly address the question. Keep your answer concise.`,
            ``,
            `---`,
            `Retrieved Repository Context (may or may not be relevant):`,
            `${truncatedContext}`,
            `---`,
            ``,
            `User Question: ${userRepoQuery}`
        ].join('\n')
        : [
            `You are an expert AI assistant analyzing a GitHub repository. The user asked: "${userRepoQuery}"`,
            ``,
            `No highly relevant code snippets or repository content were found for this query in the database. Answer using your general programming knowledge, and let the user know that this specific topic does not appear to be covered in the indexed repository files. Keep your answer concise.`
        ].join('\n');


    const aIResponse = await openrouter([{ role: "user", content: finalPrompt }])

    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ state: "success", message: aIResponse, data: null })
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

}) // end analyze-github-repo-readme

} // end registerMcpTools