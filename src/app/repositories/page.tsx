'use client';

import { useEffect, useState, useMemo } from "react";
import { ChevronRight, FolderTree, Search, FileCode2, FolderOpen, AlertCircle, History, ExternalLink, Clock } from "lucide-react";
import { fetchAllAnalysis, fetchAnalysisById } from "../(actions)/get-analysis";
import {
    buildTree, countFiles, getFileTypes, filterTree,
    FolderIcon, FileIcon,
    type TreeNode,
} from "../lib/treeUtils";
import "./RepositoryExplorer.css";

/* ── Tree node view ──────────────────────────────────────── */
function TreeNodeView({
    node,
    depth = 0,
    searchQuery,
    selectedPath,
    onSelect,
}: {
    node: TreeNode;
    depth?: number;
    searchQuery: string;
    selectedPath: string | null;
    onSelect: (node: TreeNode) => void;
}) {
    const [open, setOpen] = useState(depth < 2 || searchQuery.length > 0);
    const indent = depth * 16;
    const isSelected = selectedPath === node.path;

    useEffect(() => {
        if (searchQuery.length > 0) setOpen(true);
    }, [searchQuery]);

    if (node.type === "folder") {
        return (
            <div className="re-node">
                <button
                    className={`re-folder-btn ${isSelected ? "re-item-selected" : ""}`}
                    style={{ paddingLeft: `${indent + 12}px` }}
                    onClick={() => { setOpen((o) => !o); onSelect(node); }}
                >
                    <ChevronRight size={14} className={`re-chevron ${open ? "re-chevron--open" : ""}`} />
                    <FolderIcon open={open} />
                    <span className="re-folder-name">{node.name}</span>
                    {node.children.length > 0 && (
                        <span className="re-folder-count">{node.children.length}</span>
                    )}
                </button>
                {open && node.children.length > 0 && (
                    <div className="re-children" style={{ paddingLeft: `${indent + 24}px` }}>
                        <div className="re-indent-line" />
                        {node.children.map((child, i) => (
                            <TreeNodeView
                                key={i}
                                node={child}
                                depth={depth + 1}
                                searchQuery={searchQuery}
                                selectedPath={selectedPath}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            className={`re-file-row ${isSelected ? "re-item-selected" : ""}`}
            style={{ paddingLeft: `${indent + 32}px` }}
            onClick={() => onSelect(node)}
        >
            <FileIcon name={node.name} />
            <span className="re-file-name">{node.name}</span>
        </button>
    );
}

/* ── History panel ───────────────────────────────────────── */
function HistoryPanel({
    onSelect,
    activeId,
}: {
    onSelect: (id: number) => void;
    activeId: number | null;
}) {
    const [analysisList, setAnalysisList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllAnalysis().then((rows) => {
            setAnalysisList(rows);
            setLoading(false);
        });
    }, []);

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

    return (
        <aside className="re-history-panel">
            <div className="re-history-header">
                <History size={16} />
                <span>Analysis History</span>
            </div>
            {loading ? (
                <p className="re-history-empty">Loading...</p>
            ) : analysisList.length === 0 ? (
                <p className="re-history-empty">No analysis yet.</p>
            ) : (
                <ul className="re-history-list">
                    {analysisList.map((a) => (
                        <li key={a.id}>
                            <button
                                className={`re-history-item ${activeId === a.id ? "re-history-item--active" : ""}`}
                                onClick={() => onSelect(a.id)}
                            >
                                <span className="re-history-name">{getRepoName(a.repo_url)}</span>
                                <span className="re-history-meta">
                                    <Clock size={11} />
                                    {formatDate(a.analyzed_at)}
                                </span>
                                {a.repo_url && (
                                    <a
                                        href={a.repo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="re-history-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ExternalLink size={11} />
                                    </a>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}

/* ── Main page ───────────────────────────────────────────── */
export default function RepositoryExplorer() {
    const [treeData, setTreeData] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

    const handleSelectAnalysis = async (id: number) => {
        setActiveId(id);
        setSelectedNode(null);
        const row = await fetchAnalysisById(id);
        if (row?.tree) setTreeData(row.tree);
    };

    const fullTree = useMemo(() => treeData ? buildTree(treeData) : [], [treeData]);
    const filteredTree = useMemo(() => filterTree(fullTree, searchQuery), [fullTree, searchQuery]);
    const totalFiles = useMemo(() => countFiles(fullTree), [fullTree]);
    const topExtensions = useMemo(
        () => Object.entries(getFileTypes(fullTree)).sort((a, b) => b[1] - a[1]).slice(0, 3),
        [fullTree]
    );

    return (
        <div className="re-container">
            <header className="re-header">
                <div className="re-header-left">
                    <FolderTree size={24} color="#3b82f6" />
                    <h1 className="re-header-title">Repository Explorer</h1>
                </div>
                {treeData && (
                    <div className="re-stats">
                        <div className="re-stat-item">
                            <span className="re-stat-value">{totalFiles}</span>
                            <span className="re-stat-label">Total Files</span>
                        </div>
                        {topExtensions.map(([ext, count]) => (
                            <div className="re-stat-item" key={ext}>
                                <span className="re-stat-value">{count}</span>
                                <span className="re-stat-label">{ext}</span>
                            </div>
                        ))}
                    </div>
                )}
            </header>

            <main className="re-main re-main--with-history">
                {/* History panel always visible on the left */}
                <HistoryPanel onSelect={handleSelectAnalysis} activeId={activeId} />

                {!treeData ? (
                    <div className="re-content-empty re-content-empty--center">
                        <FolderTree size={48} opacity={0.5} />
                        <h3>Select a Repository</h3>
                        <p>Pick a past analysis from the History panel, or analyze a new repo on the Home page.</p>
                    </div>
                ) : (
                    <>
                        <aside className="re-sidebar">
                            <div className="re-search">
                                <Search size={16} className="re-search-icon" />
                                <input
                                    type="text"
                                    className="re-search-input"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="re-tree">
                                {filteredTree.map((node, i) => (
                                    <TreeNodeView
                                        key={i}
                                        node={node}
                                        depth={0}
                                        searchQuery={searchQuery}
                                        selectedPath={selectedNode?.path ?? null}
                                        onSelect={setSelectedNode}
                                    />
                                ))}
                            </div>
                        </aside>

                        <section className="re-content">
                            {selectedNode ? (
                                <>
                                    <div className="re-content-header">
                                        {selectedNode.type === "folder"
                                            ? <FolderOpen size={20} color="#fbbf24" />
                                            : <FileCode2 size={20} color="#94a3b8" />}
                                        <h2 className="re-content-title">{selectedNode.name}</h2>
                                        <div className="re-content-badges">
                                            <span className="re-badge">{selectedNode.type}</span>
                                            <span className="re-badge">{selectedNode.path}</span>
                                        </div>
                                    </div>
                                    <div className="re-content-body">
                                        {selectedNode.type === "folder" ? (
                                            <div className="re-insights-grid">
                                                <div className="re-insight-card">
                                                    <span className="re-insight-label">Direct Children</span>
                                                    <span className="re-insight-value">{selectedNode.children.length}</span>
                                                </div>
                                                <div className="re-insight-card">
                                                    <span className="re-insight-label">Total Files Inside</span>
                                                    <span className="re-insight-value">{countFiles(selectedNode.children)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="re-content-empty">
                                                <FileCode2 size={40} opacity={0.3} />
                                                <p>File content preview is currently not available.</p>
                                                <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
                                                    We only have the tree metadata, not the full source code.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="re-content-empty">
                                    <AlertCircle size={40} opacity={0.3} />
                                    <p>Select a file or folder from the sidebar to view details</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
