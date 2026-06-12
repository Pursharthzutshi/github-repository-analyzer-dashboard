import { openrouter } from "../lib/openrouter/openrouter";
import { CallGithubRepo } from "./call-github-repo";

export default async function AIprompt(githubRepoUrl: string, readme: string, systemPrompt: string) {

    const { repoData, owner, repo, defaultBranch } = await CallGithubRepo(githubRepoUrl);

    const combinedData = `
    Repository Name: ${repoData.name}
    Repository README: ${readme}
    Owner: ${owner}
    Repo: ${repo}    
    `;

    const aiResponse = await openrouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedData },
    ]);

    return {
        aiResponse,
        owner,
        repo,
        defaultBranch
    }

}