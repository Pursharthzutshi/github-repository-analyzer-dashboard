import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function RepositoryGeneralOverview({ state }: { state?: any }) {
    const insightsData = useGithubRepoDataHook(state);

    return (
        <div className="repository-insights">
            {insightsData?.packageJson ? (
                <Markdown>{insightsData.packageJson}</Markdown>
            ) : (
                <p>No repository insights data yet.</p>
            )}
        </div>
    )
}
