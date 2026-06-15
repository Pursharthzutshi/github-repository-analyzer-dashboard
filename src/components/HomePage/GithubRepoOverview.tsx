import { useState } from "react";
import { BookOpen, GitBranch, User, ChevronRight } from "lucide-react";
import Markdown from "react-markdown";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import "./GithubRepoOverview.css";

export default function GithubRepoOverview({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);
    const [expanded, setExpanded] = useState(false);

    if (!githubRepoData?.readme) {
        return (
            <div className="gro-empty">
                <BookOpen size={40} strokeWidth={1.5} className="gro-empty-icon" />
                <h3>No Repository Analyzed Yet</h3>
                <p>Enter a GitHub repository URL above and click Analyze to get a full breakdown.</p>
            </div>
        );
    }

    return (
        <div className="gro-root">
            {/* Header strip */}
            <div className="gro-header">
                <div className="gro-header-left">
                    <div className="gro-icon-wrap">
                        <GitBranch size={16} />
                    </div>
                    <span className="gro-section-label">README Analysis</span>
                </div>
                <button
                    className="gro-expand-btn"
                    onClick={() => setExpanded(e => !e)}
                >
                    {expanded ? "Collapse" : "Expand"}
                    <ChevronRight size={14} style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "0.2s" }} />
                </button>
            </div>

            {/* Content */}
            <div className={`gro-content ${expanded ? "gro-content--expanded" : ""}`}>
                <Markdown>{githubRepoData.readme}</Markdown>
            </div>

            {/* Fade overlay when collapsed */}
            {!expanded && <div className="gro-fade" />}
        </div>
    );
}
