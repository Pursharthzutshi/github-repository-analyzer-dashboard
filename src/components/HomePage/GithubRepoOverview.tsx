import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function GithubRepoOverview({ state }) {

    const [githubRepoData, setGithubRepoData] = useState(null)

    useEffect(() => {
        if (state.data) {
            console.log("Parsed Data:", setGithubRepoData(JSON.parse(state.data)));
        } else {
            console.log("State:", state);
        }
    }, [state])

    return (
        <div className="github-repo-overview">
            <Markdown>{githubRepoData?.readme}</Markdown>
        </div>
    )
}

