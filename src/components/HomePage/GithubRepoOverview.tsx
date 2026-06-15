import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function GithubRepoOverview({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);

    return (
        <div className="github-repo-overview">
            {githubRepoData?.readme ? (
                <Markdown>{githubRepoData.readme}</Markdown>
            ) : (
                <p>No github repo data yet.</p>
            )}
        </div>
    )
}
