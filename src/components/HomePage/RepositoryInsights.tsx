import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function RepositoryInsights({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);

    return (
        <div className="repository-insights">
            <h3>Insights</h3>
            {githubRepoData?.insights ? (
                <Markdown>{githubRepoData.insights}</Markdown>
            ) : (
                <p>No github repo data yet.</p>
            )}
        </div>
    )
}
