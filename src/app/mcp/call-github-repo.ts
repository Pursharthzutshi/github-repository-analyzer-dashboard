export async function CallGithubRepo(githubRepoUrl: string) {

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
    }

    const fetchRepoData = await fetch(apiUrl)
    const repoData = await fetchRepoData.json();

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