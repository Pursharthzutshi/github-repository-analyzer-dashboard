import { useState } from "react";
import { ChevronRight, FolderTree } from "lucide-react";
import { buildTree, countFiles, FolderIcon, FileIcon, type TreeNode } from "../../app/lib/treeUtils";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import "./FileExplorer.css";

/* ── Tree node view ─────────────────────────────────────── */
function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
    const [open, setOpen] = useState(depth < 2);
    const indent = depth * 16;

    if (node.type === "folder") {
        return (
            <div className="fe-node">
                <button
                    className="fe-folder-btn"
                    style={{ paddingLeft: `${indent + 4}px` }}
                    onClick={() => setOpen((o) => !o)}
                >
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

/* ── Widget ─────────────────────────────────────────────── */
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
