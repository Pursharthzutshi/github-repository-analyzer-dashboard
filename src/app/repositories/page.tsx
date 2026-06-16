'use client';

import { useEffect, useState, useMemo } from "react";
import { ChevronRight, FolderTree, Search, FileCode2, FolderOpen, AlertCircle } from "lucide-react";
import { getLatestAnalysisFromStorage } from "../lib/storage";
import {
    buildTree, countFiles, getFileTypes, filterTree,
    FolderIcon, FileIcon,
    type TreeNode,
} from "../lib/treeUtils";
import "./RepositoryExplorer.css";

/* ── Tree node view (defined outside component to avoid re-creating on render) ── */
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

/* ── Main page ───────────────────────────────────────────── */
export default function RepositoryExplorer() {
    const [treeData, setTreeData] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

    useEffect(() => {
        const latest = getLatestAnalysisFromStorage();
        if (latest?.data) {
            try {
                const parsed = JSON.parse(latest.data);
                if (parsed?.tree) setTreeData(parsed.tree);
            } catch (e) {
                console.error("Failed to parse tree data", e);
            }
        }
    }, []);

    const fullTree    = useMemo(() => treeData ? buildTree(treeData) : [], [treeData]);
    const filteredTree = useMemo(() => filterTree(fullTree, searchQuery), [fullTree, searchQuery]);
    const totalFiles  = useMemo(() => countFiles(fullTree), [fullTree]);
    const topExtensions = useMemo(
        () => Object.entries(getFileTypes(fullTree)).sort((a, b) => b[1] - a[1]).slice(0, 3),
        [fullTree]
    );

    if (!treeData) {
        return (
            <div className="re-container">
                <div className="re-content-empty">
                    <FolderTree size={48} opacity={0.5} />
                    <h3>No Repository Data</h3>
                    <p>Analyze a repository on the Home page to view its structure here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="re-container">
            <header className="re-header">
                <div className="re-header-left">
                    <FolderTree size={24} color="#3b82f6" />
                    <h1 className="re-header-title">Repository Explorer</h1>
                </div>
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
            </header>

            <main className="re-main">
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
            </main>
        </div>
    );
}
