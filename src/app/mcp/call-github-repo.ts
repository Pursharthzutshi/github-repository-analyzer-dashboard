export async function CallGithubRepo(githubRepoUrl: string) {

    let apiUrl = githubRepoUrl;
    try {
        const url = new URL(githubRepoUrl);
        if (url.hostname === "github.com") {
            const pathParts = url.pathname.split("/").filter(Boolean);
            if (pathParts.length >= 2) {
                apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
            } else if (pathParts.length === 1) {
                // Organization URL — not a repo URL
                throw new Error(
                    `"${githubRepoUrl}" is a GitHub organization URL, not a repository URL. ` +
                    `Please enter a full repository URL like: https://github.com/${pathParts[0]}/<repo-name>`
                );
            } else {
                throw new Error(`Invalid GitHub URL: "${githubRepoUrl}". Please enter a valid repository URL.`);
            }
        } else {
            throw new Error(`Only github.com URLs are supported. Received: "${githubRepoUrl}"`);
        }
    } catch (e) {
        // Re-throw our own errors; only swallow URL parse errors
        if (e instanceof TypeError) {
            throw new Error(`Invalid URL: "${githubRepoUrl}". Please enter a valid GitHub repository URL.`);
        }
        throw e;
    }

    const fetchRepoData = await fetch(apiUrl);
    if (!fetchRepoData.ok) {
        throw new Error(`GitHub API returned ${fetchRepoData.status}: Could not fetch repository data for "${githubRepoUrl}".`);
    }
    const repoData = await fetchRepoData.json();

    if (!repoData.owner || !repoData.name) {
        throw new Error(`Unexpected response from GitHub API. Make sure "${githubRepoUrl}" points to a valid public repository.`);
    }

    const owner = repoData.owner.login;
    const repo = repoData.name;
    const defaultBranch = repoData.default_branch || "main";

    return {
        repoData,
        owner,
        repo,
        defaultBranch,
    }
}