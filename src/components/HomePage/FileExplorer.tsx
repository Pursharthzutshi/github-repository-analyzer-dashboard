import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function FileExplorer({ state }: { state?: any }) {
    const [fileTreeData, setFileTreeData] = useState<any>(null)

    useEffect(() => {
        if (state?.data) {
            try {
                const parsed = JSON.parse(state.data);
                setFileTreeData(parsed);
            } catch (e) {
                console.error("Failed to parse data in FileExplorer", e);
            }
        }
    }, [state])

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

