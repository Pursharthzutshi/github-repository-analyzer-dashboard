
import { PieChart } from "lucide-react";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import "./RepositoryInsights.css";

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
    Rust: "#ce422b", Go: "#00ADD8", Java: "#b07219", CSS: "#563d7c",
    HTML: "#e34c26", Shell: "#4eaa25", Ruby: "#cc342d", Swift: "#f05138",
    Kotlin: "#7F52FF", Dart: "#00B4AB", "C++": "#f34b7d", C: "#555555",
    PHP: "#777bb4", Dockerfile: "#384d54", MDX: "#fcb32c", Makefile: "#427819",
    SCSS: "#c6538c", Vue: "#41b883", Svelte: "#ff3e00",
};
const FALLBACK = ["#6366f1","#ec4899","#14b8a6","#f59e0b","#8b5cf6","#10b981","#ef4444","#3b82f6"];

function langColor(lang: string, i: number): string {
    return LANG_COLORS[lang] ?? FALLBACK[i % FALLBACK.length];
}

interface LangEntry { language: string; bytes: number; percentage: number; }

function DonutChart({ langs }: { langs: LangEntry[] }) {
    const R = 36, CX = 44, CY = 44, STROKE = 14;
    const circumference = 2 * Math.PI * R;
    let cumulativePct = 0;

    const segments = langs.map((l, i) => {
        const startPct = cumulativePct;
        cumulativePct += l.percentage;
        const offset = circumference - (l.percentage / 100) * circumference;
        const rotate = (startPct / 100) * 360 - 90;
        return { ...l, offset, rotate, color: langColor(l.language, i) };
    });

    return (
        <div className="ri-donut-wrap">
            <svg width="88" height="88" viewBox="0 0 88 88">
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={STROKE} />
                {segments.map(seg => (
                    <circle
                        key={seg.language}
                        cx={CX} cy={CY} r={R}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={STROKE}
                        strokeDasharray={circumference}
                        strokeDashoffset={seg.offset}
                        strokeLinecap="butt"
                        transform={`rotate(${seg.rotate} ${CX} ${CY})`}
                        className="ri-donut-segment"
                    />
                ))}
            </svg>
        </div>
    );
}

export default function RepositoryInsights({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);

    let langs: LangEntry[] = [];
    if (githubRepoData?.languages) {
        try { langs = JSON.parse(githubRepoData.languages); } catch { /* not JSON */ }
    }

    if (!langs || langs.length === 0) {
        return (
            <div className="ri-empty">
                <div className="ri-empty-icon-wrap">
                    <PieChart size={24} strokeWidth={1.5} />
                </div>
                <h3 className="ri-empty-title">Repository Insights</h3>
                <p className="ri-empty-desc">Analyze a repository to see its language breakdown.</p>
            </div>
        );
    }

    const displayLangs = langs.slice(0, 5);
    const hasMore = langs.length > 5;

    return (
        <div className="ri-root">
            <div className="ri-header">
                <span className="ri-header-label">Repository Insights</span>
            </div>

            <div className="ri-body">
                <DonutChart langs={langs} />

                <div className="ri-legend">
                    {displayLangs.map((l, i) => {
                        const c = langColor(l.language, i);
                        return (
                            <div className="ri-legend-item" key={l.language}>
                                <div className="ri-legend-left">
                                    <span className="ri-color-box" style={{ background: c }} />
                                    <span className="ri-lang-name">{l.language}</span>
                                </div>
                                <span className="ri-lang-pct">{l.percentage.toFixed(1)}%</span>
                            </div>
                        );
                    })}
                    {hasMore && (
                        <div className="ri-legend-item">
                            <div className="ri-legend-left">
                                <span className="ri-color-box" style={{ background: "var(--text-muted)" }} />
                                <span className="ri-lang-name">Other</span>
                            </div>
                            <span className="ri-lang-pct">
                                {langs.slice(5).reduce((sum, l) => sum + l.percentage, 0).toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
