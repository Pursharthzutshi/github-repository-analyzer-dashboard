'use client';

import type { JSX } from "react";
import { useEffect, useState, useMemo } from "react";
import { ChevronRight, FolderTree, Search, FileCode2, FolderOpen, AlertCircle } from "lucide-react";
import { getLatestAnalysisFromStorage } from "../lib/storage";
import "./RepositoryExplorer.css";

/* ── Shared logic copied from FileExplorer for simplicity ── */
interface TreeNode { name: string; type: "file" | "folder"; children: TreeNode[]; path: string; }

function buildTree(text: string): TreeNode[] {
    const lines = text.split("\n").map(l => l.replace(/```[\s\S]*?```/g, "")).filter(Boolean);
    const root: TreeNode[] = [];
    const stack: { node: TreeNode; depth: number }[] = [];

    for (const line of lines) {
        const cleaned = line.replace(/[│├└─\s]/g, " ").trim();
        if (!cleaned || cleaned.length < 2 || cleaned.length > 80) continue;
        const depth = Math.floor((line.length - line.trimStart().length) / 2);
        const isFolder = cleaned.endsWith("/") || (!cleaned.includes(".") && !cleaned.includes("#"));
        const name = cleaned.replace(/\/$/, "");
        if (!name) continue;
        
        // Calculate full path
        let parentPath = "";
        if (stack.length > 0) {
            let parentDepthIndex = stack.length - 1;
            while (parentDepthIndex >= 0 && stack[parentDepthIndex].depth >= depth) {
                parentDepthIndex--;
            }
            if (parentDepthIndex >= 0) {
                parentPath = stack[parentDepthIndex].node.path + "/";
            }
        }
        
        const path = parentPath + name;
        const node: TreeNode = { name, type: isFolder ? "folder" : "file", children: [], path };
        
        while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop();
        if (stack.length === 0) root.push(node);
        else stack[stack.length - 1].node.children.push(node);
        if (isFolder) stack.push({ node, depth });
    }
    return root;
}

const FolderIcon = ({ open }: { open: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {open ? (
            <>
                <path d="M1 4a1 1 0 011-1h4l1.5 1.5H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill="#f59e0b" opacity="0.9"/>
                <path d="M1 6h14v6a1 1 0 01-1 1H2a1 1 0 01-1-1V6z" fill="#fbbf24"/>
            </>
        ) : (
            <>
                <path d="M1 4a1 1 0 011-1h4l1.5 1.5H14a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" fill="#f59e0b"/>
                <path d="M1 6h14v6a1 1 0 01-1 1H2a1 1 0 01-1-1V6z" fill="#fcd34d" opacity="0.6"/>
            </>
        )}
    </svg>
);

function FileIcon({ name }: { name: string }) {
    const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
    const icons: Record<string, JSX.Element> = {
        ts: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#3178c6"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">TS</text></svg>,
        tsx: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#3178c6"/><text x="1" y="12" fontSize="8" fontWeight="800" fill="white" fontFamily="monospace">TSX</text></svg>,
        js: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f7df1e"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="#111" fontFamily="monospace">JS</text></svg>,
        json: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f59e0b"/><text x="0" y="12" fontSize="7" fontWeight="800" fill="white" fontFamily="monospace">JSON</text></svg>,
        md: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#475569"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">M↓</text></svg>,
        css: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#563d7c"/><text x="1" y="12" fontSize="8" fontWeight="800" fill="white" fontFamily="monospace">CSS</text></svg>,
    };

    return icons[ext] ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="10" height="14" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.75"/>
            <path d="M8 1v4h4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.75"/>
            <path d="M8 1l4 4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.75"/>
        </svg>
    );
}

function countFiles(nodes: TreeNode[]): number {
    return nodes.reduce((acc, n) => acc + (n.type === "file" ? 1 : countFiles(n.children)), 0);
}

function getFileTypes(nodes: TreeNode[], exts: Record<string, number> = {}): Record<string, number> {
    for (const node of nodes) {
        if (node.type === "file") {
            const ext = node.name.includes(".") ? "." + node.name.split(".").pop()!.toLowerCase() : "other";
            exts[ext] = (exts[ext] || 0) + 1;
        } else {
            getFileTypes(node.children, exts);
        }
    }
    return exts;
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
    if (!query) return nodes;
    const lowerQuery = query.toLowerCase();
    
    return nodes.reduce<TreeNode[]>((acc, node) => {
        if (node.type === "file") {
            if (node.name.toLowerCase().includes(lowerQuery)) {
                acc.push(node);
            }
        } else {
            const filteredChildren = filterTree(node.children, query);
            if (filteredChildren.length > 0 || node.name.toLowerCase().includes(lowerQuery)) {
                acc.push({ ...node, children: filteredChildren });
            }
        }
        return acc;
    }, []);
}

export default function RepositoryExplorer() {
    const [treeData, setTreeData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

    useEffect(() => {
        const latest = getLatestAnalysisFromStorage();
        if (latest?.data) {
            try {
                const parsed = JSON.parse(latest.data);
                if (parsed?.tree) {
                    setTreeData(parsed.tree);
                }
            } catch(e) {
                console.error("Failed to parse", e);
            }
        }
    }, []);

    const fullTree = useMemo(() => treeData ? buildTree(treeData) : [], [treeData]);
    const filteredTree = useMemo(() => filterTree(fullTree, searchQuery), [fullTree, searchQuery]);
    
    const totalFiles = useMemo(() => countFiles(fullTree), [fullTree]);
    const fileTypes = useMemo(() => getFileTypes(fullTree), [fullTree]);
    
    const topExtensions = Object.entries(fileTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const TreeNodeView = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
        const [open, setOpen] = useState(depth < 2 || searchQuery.length > 0);
        const indent = depth * 16;
        const isSelected = selectedNode?.path === node.path;

        useEffect(() => {
            if (searchQuery.length > 0) setOpen(true);
        }, [searchQuery]);

        if (node.type === "folder") {
            return (
                <div className="re-node">
                    <button 
                        className={`re-folder-btn ${isSelected ? 're-item-selected' : ''}`} 
                        style={{ paddingLeft: `${indent + 12}px` }} 
                        onClick={() => {
                            setOpen(o => !o);
                            setSelectedNode(node);
                        }}
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
                                <TreeNodeView key={i} node={child} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button 
                className={`re-file-row ${isSelected ? 're-item-selected' : ''}`} 
                style={{ paddingLeft: `${indent + 32}px` }}
                onClick={() => setSelectedNode(node)}
            >
                <FileIcon name={node.name} />
                <span className="re-file-name">{node.name}</span>
            </button>
        );
    };

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
                            <TreeNodeView key={i} node={node} depth={0} />
                        ))}
                    </div>
                </aside>

                <section className="re-content">
                    {selectedNode ? (
                        <>
                            <div className="re-content-header">
                                {selectedNode.type === "folder" ? <FolderOpen size={20} color="#fbbf24" /> : <FileCode2 size={20} color="#94a3b8" />}
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
                                        <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>We only have the tree metadata, not the full source code.</p>
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
