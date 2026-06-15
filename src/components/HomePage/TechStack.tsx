import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function TechStack({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);

    return (
        <div className="tech-stack">
            <h3 className="tech-stack-title">Tech Stack</h3>
            {githubRepoData?.languages ? (
                <div className="tech-stack-content">
                    <Markdown>{githubRepoData.languages}</Markdown>
                </div>
            ) : (
                <p className="tech-stack-empty">No tech stack data yet. Analyze a repository to see languages used.</p>
            )}
        </div>
    )
}
