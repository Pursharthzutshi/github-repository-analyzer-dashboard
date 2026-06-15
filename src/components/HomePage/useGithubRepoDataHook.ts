import { useState, useEffect } from "react";

export default function useGithubRepoDataHook(state?: any) {
    const [parsedData, setParsedData] = useState<any>(null);

    useEffect(() => {
        if (state?.data) {
            try {
                const parsed = JSON.parse(state.data);
                setParsedData(parsed);
            } catch (e) {
                console.error("Failed to parse data in useGithubRepoDataHook", e);
            }
        }
    }, [state]);

    return parsedData;
}