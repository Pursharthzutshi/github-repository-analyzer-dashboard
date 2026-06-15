import type { JSX } from "react";
import { useState } from "react";
import { ChevronRight, FolderTree } from "lucide-react";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import "./FileExplorer.css";

/* ── Inline SVG 2D file icons ─────────────────────────── */
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

/* File icons keyed by extension */
function FileIcon({ name }: { name: string }) {
    const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : (name.startsWith(".") ? name.slice(1).toLowerCase() : "");

    const icons: Record<string, JSX.Element> = {
        ts: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#3178c6"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">TS</text></svg>,
        tsx: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#3178c6"/><text x="1" y="12" fontSize="8" fontWeight="800" fill="white" fontFamily="monospace">TSX</text></svg>,
        js: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f7df1e"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="#111" fontFamily="monospace">JS</text></svg>,
        jsx: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#61dafb"/><text x="1" y="12" fontSize="8" fontWeight="800" fill="#111" fontFamily="monospace">JSX</text></svg>,
        css: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#563d7c"/><text x="1" y="12" fontSize="8" fontWeight="800" fill="white" fontFamily="monospace">CSS</text></svg>,
        scss: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#c6538c"/><text x="0.5" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">SCSS</text></svg>,
        json: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f59e0b"/><text x="0" y="12" fontSize="7" fontWeight="800" fill="white" fontFamily="monospace">JSON</text></svg>,
        md: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#475569"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">M↓</text></svg>,
        mdx: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#fcb32c"/><text x="0.5" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">MDX</text></svg>,
        py: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#3572A5"/><text x="2.5" y="12" fontSize="9" fontWeight="800" fill="#ffd43b" fontFamily="monospace">Py</text></svg>,
        go: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#00ADD8"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">go</text></svg>,
        rs: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#ce422b"/><text x="2.5" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">Rs</text></svg>,
        html: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#e34c26"/><text x="0.5" y="12" fontSize="7" fontWeight="800" fill="white" fontFamily="monospace">HTML</text></svg>,
        svg: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#ff9900"/><circle cx="8" cy="8" r="4" fill="white" opacity="0.7"/></svg>,
        png: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#10b981"/><text x="0" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">PNG</text></svg>,
        jpg: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#10b981"/><text x="0" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">JPG</text></svg>,
        ico: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#10b981"/><text x="1" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">ICO</text></svg>,
        sh: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#4eaa25"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">$_</text></svg>,
        mjs: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f7df1e"/><text x="0.5" y="12" fontSize="7.5" fontWeight="800" fill="#111" fontFamily="monospace">MJS</text></svg>,
        yaml: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#cb171e"/><text x="0" y="12" fontSize="7" fontWeight="800" fill="white" fontFamily="monospace">YAML</text></svg>,
        yml: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#cb171e"/><text x="1" y="12" fontSize="7.5" fontWeight="800" fill="white" fontFamily="monospace">YML</text></svg>,
        toml: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#6e4c13"/><text x="0" y="12" fontSize="7" fontWeight="800" fill="white" fontFamily="monospace">TOML</text></svg>,
        lock: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#64748b"/><rect x="4" y="7" width="8" height="6" rx="1" fill="white" opacity="0.8"/><path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" stroke="white" strokeWidth="1.5" fill="none"/></svg>,
        env: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f59e0b"/><rect x="4" y="7" width="8" height="6" rx="1" fill="white" opacity="0.8"/><path d="M5.5 7V5.5a2.5 2.5 0 015 0V7" stroke="white" strokeWidth="1.5" fill="none"/></svg>,
        gitignore: <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#f14e32"/><text x="2" y="12" fontSize="9" fontWeight="800" fill="white" fontFamily="monospace">git</text></svg>,
    };

    return icons[ext] ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="10" height="14" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.75"/>
            <path d="M8 1v4h4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.75"/>
            <path d="M8 1l4 4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.75"/>
            <line x1="4" y1="8" x2="10" y2="8" stroke="#94a3b8" strokeWidth="0.8"/>
            <line x1="4" y1="10.5" x2="9" y2="10.5" stroke="#94a3b8" strokeWidth="0.8"/>
        </svg>
    );
}

/* ── Tree logic ───────────────────────────────────────── */
interface TreeNode { name: string; type: "file" | "folder"; children: TreeNode[]; }

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
        const node: TreeNode = { name, type: isFolder ? "folder" : "file", children: [] };
        while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop();
        if (stack.length === 0) root.push(node);
        else stack[stack.length - 1].node.children.push(node);
        if (isFolder) stack.push({ node, depth });
    }
    return root;
}

function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
    const [open, setOpen] = useState(depth < 2);
    const indent = depth * 16;

    if (node.type === "folder") {
        return (
            <div className="fe-node">
                <button className="fe-folder-btn" style={{ paddingLeft: `${indent + 4}px` }} onClick={() => setOpen(o => !o)}>
                    <ChevronRight size={11} className={`fe-chevron ${open ? "fe-chevron--open" : ""}`} />
                    <FolderIcon open={open} />
                    <span className="fe-folder-name">{node.name}</span>
                    {node.children.length > 0 && (
                        <span className="fe-folder-count">{node.children.length}</span>
                    )}
                </button>
                {open && node.children.length > 0 && (
                    <div className="fe-children" style={{ paddingLeft: `${indent + 20}px` }}>
                        <div className="fe-indent-line" />
                        <div className="fe-children-inner">
                            {node.children.map((child, i) => (
                                <TreeNodeView key={i} node={child} depth={depth + 1} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="fe-file-row" style={{ paddingLeft: `${indent + 24}px` }}>
            <FileIcon name={node.name} />
            <span className="fe-file-name">{node.name}</span>
        </div>
    );
}

/* ── Count total files ────────────────────────────────── */
function countFiles(nodes: TreeNode[]): number {
    return nodes.reduce((acc, n) => acc + (n.type === "file" ? 1 : countFiles(n.children)), 0);
}

export default function FileExplorer({ state }: { state?: any }) {
    const fileTreeData = useGithubRepoDataHook(state);

    if (!fileTreeData?.tree) {
        return (
            <div className="fe-empty">
                <div className="fe-empty-icon-wrap">
                    <FolderTree size={26} strokeWidth={1.5} />
                </div>
                <h3 className="fe-empty-title">File Explorer</h3>
                <p className="fe-empty-desc">Analyze a repository to browse its file structure.</p>
            </div>
        );
    }

    const tree = buildTree(fileTreeData.tree);
    const fileCount = countFiles(tree);

    return (
        <div className="fe-root">
            <div className="fe-header">
                <div className="fe-header-left">
                    <div className="fe-icon-wrap"><FolderTree size={14} /></div>
                    <span className="fe-section-label">File Explorer</span>
                </div>
                <div className="fe-header-badges">
                    <span className="fe-badge fe-badge--folder">📁 {tree.length}</span>
                    <span className="fe-badge fe-badge--file">📄 {fileCount}</span>
                </div>
            </div>
            <div className="fe-tree">
                {tree.map((node, i) => <TreeNodeView key={i} node={node} depth={0} />)}
            </div>
        </div>
    );
}
