'use client';

import { useEffect, useState } from "react";
import { History, Clock, ExternalLink } from "lucide-react";
import { fetchAllAnalyses, fetchAnalysisById } from "../../app/(actions)/get-analysis";
import { saveAnalysisToStorage } from "../../app/lib/storage";
import "./RecentAnalyses.css";

export default function RecentAnalyses({ onSelectAnalysis }: { onSelectAnalysis: (data: any) => void }) {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllAnalyses().then((rows) => {
            setAnalyses(rows);
            setLoading(false);
        });
    }, []);

    const handleSelect = async (id: number) => {
        const row = await fetchAnalysisById(id);
        if (row) {
            // Reconstruct the parsed analysis shape the frontend expects
            const reconstructedData = {
                repo_url: row.repo_url,
                readme: row.readme,
                tree: row.tree,
                packageJson: row.packagejson, // note Postgres lowercases column names if not quoted
                insights: row.insights,
                languages: row.languages
            };

            // Note: Postgres columns might be lowercase. Let's handle both.
            if (row.packageJson && !row.packagejson) reconstructedData.packageJson = row.packageJson;

            const newState = {
                state: "Success",
                message: "Loaded from history",
                data: JSON.stringify(reconstructedData),
                timestamp: Date.now()
            };
            saveAnalysisToStorage(newState);
            onSelectAnalysis(newState);
        }
    };

    const formatDate = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const getRepoName = (url: string | null) => {
        if (!url) return "Unknown Repo";
        try {
            const parts = new URL(url).pathname.split("/").filter(Boolean);
            return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : url;
        } catch {
            return url;
        }
    };

    if (loading) return null;
    if (analyses.length === 0) return null;

    return (
        <div className="recent-analyses-container">
            <div className="recent-analyses-header">
                <History size={16} />
                <span>Recent Analyses</span>
            </div>
            <div className="recent-analyses-list">
                {analyses.map(a => (
                    <button key={a.id} className="recent-analysis-item" onClick={() => handleSelect(a.id)}>
                        <span className="ra-name">{getRepoName(a.repo_url)}</span>
                        <span className="ra-meta">
                            <Clock size={12} />
                            {formatDate(a.analyzed_at)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
