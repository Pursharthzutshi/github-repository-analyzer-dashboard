import { useState, useEffect } from "react";
import { getLatestAnalysis } from "../../app/(actions)/github-analysis";

export default function useGithubRepoDataHook(state?: any) {
    const [parsedData, setParsedData] = useState<any>(null);

    useEffect(() => {
        async function fetchAndParse() {
            let dataToParse = state?.data;

            if (!dataToParse) {
                const latest = await getLatestAnalysis();
                if (latest?.data) {
                    dataToParse = latest.data;
                }
            }

            if (dataToParse) {
                try {
                    const parsed = JSON.parse(dataToParse);
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
        }

        fetchAndParse();
    }, [state]);

    return parsedData;
}