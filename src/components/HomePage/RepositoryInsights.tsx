import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function RepositoryInsights({ state }: { state?: any }) {
    const [insightsData, setInsightsData] = useState<any>(null)

    useEffect(() => {
        if (state?.data) {
            try {
                const parsed = JSON.parse(state.data);
                setInsightsData(parsed);
            } catch (e) {
                console.error("Failed to parse data in RepositoryInsights", e);
            }
        }
    }, [state])

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
