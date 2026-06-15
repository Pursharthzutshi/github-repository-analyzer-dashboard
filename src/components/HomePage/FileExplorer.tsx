import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function FileExplorer({ state }: { state?: any }) {
    const fileTreeData = useGithubRepoDataHook(state);

    return (
        <div className="file-explorer">
            {fileTreeData?.tree ? (
                <Markdown>{fileTreeData.tree}</Markdown>
            ) : (
                <p>No file tree data yet.</p>
            )}
        </div>
    )
}
