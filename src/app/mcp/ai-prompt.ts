import { openrouter } from "../lib/openrouter/openrouter";

export default async function AIprompt(repoData: any, owner: string, repo: string, fileContent: string, systemPrompt: string) {

    const combinedData = `
    Repository Name: ${repoData.name}
    Content to Analyze: ${fileContent}
    Owner: ${owner}
    Repo: ${repo}    
    `;

    const aiResponse = await openrouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedData },
    ]);

    return aiResponse;
}