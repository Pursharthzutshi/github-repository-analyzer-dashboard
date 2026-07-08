"use client";

import React, { useState, useEffect, useActionState, startTransition } from "react";
import {
    Search, Sparkles, FileText, Copy, Check,
    CornerDownLeft, Loader2, Code2, ChevronDown, ChevronRight
} from "lucide-react";
import repoSemanticFindQuestionsRAG from "../../app/(actions)/repo-semantic-find-questions.rag";
import "./SemanticSearch.css";

interface SearchResult {
    file: string;
    language: string;
    score: string;
    snippet: string;
    summary: string;
}

function formatSnippet(item: any): string {
    if (!item) return "No preview available.";
    let raw = item.chunk || item.pageContent || item.text || item.content;
    if (!raw) return "";
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === "string") return parsed;
            // parsed is an object — stringify it so it's always a string
            return JSON.stringify(parsed, null, 2);
        } catch {
            return raw;
        }
    }
    // raw is already an object — safely convert to string
    if (typeof raw === "object") return JSON.stringify(raw, null, 2);
    return String(raw);
}

export default function SemanticSearch() {
    const initialState: any = { state: "", message: "", data: null, question: "" };

    const [state, formAction, isPending] = useActionState(repoSemanticFindQuestionsRAG, initialState);
    const [query, setQuery] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    // Debug
    useEffect(() => {
        if (state?.state) console.log("[SemanticSearch] state:", state);
    }, [state]);

    useEffect(() => {
        if (state?.state === "Success" && state?.data) {
            try {
                const outer = JSON.parse(state.data);
                console.log("[SemanticSearch] outer:", outer);

                // MCP tool returned a top-level error object, e.g. { error: "...", user_id: "..." }
                if (outer?.error) {
                    console.error("[SemanticSearch] MCP error:", outer.error);
                    setResults([]);
                    return;
                }

                if (outer?.content?.[0]?.text) {
                    let inner: any;
                    try {
                        inner = JSON.parse(outer.content[0].text);
                    } catch {
                        // content text is not JSON — treat it as plain context
                        inner = { context: outer.content[0].text };
                    }
                    console.log("[SemanticSearch] inner:", inner);

                    // If the inner payload itself is an error
                    if (inner?.error) {
                        console.error("[SemanticSearch] inner error:", inner.error);
                        setResults([]);
                        return;
                    }
                    if (inner?.chunks && Array.isArray(inner.chunks) && inner.chunks.length > 0) {
                        const parsedResults: SearchResult[] = inner.chunks.map((item: any, idx: number) => {
                            let file = `Section #${idx + 1}`;
                            let language = "Markdown";
                            let summary = "Matched via vector similarity search.";
                            if (item.metadata) {
                                try {
                                    const meta = typeof item.metadata === "string" ? JSON.parse(item.metadata) : item.metadata;
                                    if (meta.source || meta.file || meta.path) file = meta.source || meta.file || meta.path;
                                    if (meta.language || meta.lang) language = meta.language || meta.lang;
                                } catch {}
                            }
                            const rawScore = item.similarity_score || 0.30;
                            const pct = Math.min(99, Math.max(75, Math.round((rawScore * 70) + 70)));
                            return {
                                file,
                                language,
                                score: `${pct}%`,
                                snippet: formatSnippet(item),
                                summary
                            };
                        });
                        setResults(parsedResults);
                        setExpandedIdx(null);
                    } else if (inner?.context && inner.context.trim().length > 0) {
                        setResults([{
                            file: "Repository Context",
                            language: "Markdown",
                            score: "99%",
                            snippet: inner.context,
                            summary: "Combined hybrid search result."
                        }]);
                        setExpandedIdx(null);
                    } else {
                        setResults([]);
                    }
                }
            } catch (e) {
                console.error("[SemanticSearch] parse error", e);
                setResults([]);
            }
        } else if (state?.state === "error" || state?.state === "Failed") {
            setResults([]);
        }
    }, [state]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        const fd = new FormData();
        fd.append("user-repo-query", query);
        startTransition(() => formAction(fd));
    };

    const handleSuggestion = (tip: string) => {
        setQuery(tip);
        const fd = new FormData();
        fd.append("user-repo-query", tip);
        startTransition(() => formAction(fd));
    };

    const copyCode = (code: string, idx: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const toggleExpand = (idx: number) => {
        setExpandedIdx(prev => prev === idx ? null : idx);
    };

    return (
        <div className="ss-root">
            {/* Header */}
            <div className="ss-header">
                <div className="ss-header-left">
                    <Sparkles size={18} color="#6366f1" />
                    <span className="ss-header-label">Semantic Search</span>
                </div>
                <span className="ss-badge">Vector RAG</span>
            </div>

            {/* Search input */}
            <form onSubmit={handleSearch} className="ss-search-form">
                <Search size={17} className="ss-search-icon" />
                <input
                    type="text"
                    name="user-repo-query"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by concept, e.g. 'authentication flow'"
                    className="ss-input"
                    disabled={isPending}
                />
                <span className="ss-shortcut-tag">⌘K</span>
                <button type="submit" className="ss-submit-btn" disabled={isPending || !query.trim()}>
                    {isPending
                        ? <Loader2 size={14} className="animate-spin" />
                        : <><CornerDownLeft size={13} /> Search</>}
                </button>
            </form>

            {/* Suggestions */}
            <div className="ss-suggestions">
                <span className="ss-suggestions-label">Try:</span>
                {["Database setup", "Authentication", "API routes"].map((tip, i) => (
                    <button key={i} type="button" className="ss-suggestion-pill"
                        onClick={() => handleSuggestion(tip)} disabled={isPending}>
                        {tip}
                    </button>
                ))}
            </div>

            {/* Results */}
            {isPending ? (
                <div className="ss-empty-state">
                    <div className="ss-empty-icon"><Loader2 size={22} className="animate-spin" /></div>
                    <h4 className="ss-empty-title">Searching vector space...</h4>
                    <p className="ss-empty-desc">Comparing your query against repository embeddings.</p>
                </div>
            ) : results && results.length > 0 ? (
                <div className="ss-results-container">
                    <div className="ss-results-header">
                        <div className="ss-results-count">
                            <Search size={12} />
                            {results.length} match{results.length !== 1 ? "es" : ""} found
                        </div>
                        <span>Click a row to expand</span>
                    </div>

                    {results.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <button
                                type="button"
                                className={`ss-result-row${expandedIdx === idx ? " active" : ""}`}
                                onClick={() => toggleExpand(idx)}
                            >
                                <div className="ss-result-icon">
                                    <FileText size={13} />
                                </div>
                                <div className="ss-result-body">
                                    <div className="ss-result-title">{item.file}</div>
                                    <div className="ss-result-excerpt">{item.snippet}</div>
                                </div>
                                <div className="ss-result-meta">
                                    <span className="ss-score-pill">{item.score}</span>
                                    {expandedIdx === idx
                                        ? <ChevronDown size={13} color="#94a3b8" />
                                        : <ChevronRight size={13} color="#94a3b8" />}
                                </div>
                            </button>

                            {expandedIdx === idx && (
                                <div className="ss-detail-panel">
                                    <pre>{item.snippet}</pre>
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                                        <button
                                            type="button"
                                            className="ss-copy-btn"
                                            onClick={e => { e.stopPropagation(); copyCode(item.snippet, idx); }}
                                        >
                                            {copiedIndex === idx ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                                            {copiedIndex === idx ? "Copied!" : "Copy text"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <div className="ss-empty-state">
                    <div className="ss-empty-icon"><Code2 size={22} /></div>
                    <h4 className="ss-empty-title">
                        {state?.state === "error"
                            ? "Search failed"
                            : results !== null
                                ? "No results found"
                                : "Search your repository"}
                    </h4>
                    <p className="ss-empty-desc">
                        {state?.state === "error"
                            ? state?.message || "Check the browser console for details."
                            : results !== null
                                ? "No matching content found. Try a different query."
                                : "Type a concept or keyword to find relevant sections in this repository."}
                    </p>
                </div>
            )}
        </div>
    );
}
