import { useState, useEffect } from "react";


export default function useGithubRepoDataHook(state?: any) {
    const [parsedData, setParsedData] = useState<any>(null);

    useEffect(() => {
        if (state?.data) {
            try {
                const parsed = JSON.parse(state.data);
                // If data is missing insights or languages it's pre-v2 cached data — discard it
                if (parsed && (parsed.insights === undefined || parsed.languages === undefined)) {
                    console.warn("[useGithubRepoDataHook] Stale data detected (missing insights/languages). Clearing cache.");
                    localStorage.removeItem("latest_github_analysis");
                    setParsedData(null);
                    return;
                }
                setParsedData(parsed);
            } catch (e) {
                console.error("Failed to parse data in useGithubRepoDataHook", e);
            }
        }
    }, [state]);

    return parsedData;
}