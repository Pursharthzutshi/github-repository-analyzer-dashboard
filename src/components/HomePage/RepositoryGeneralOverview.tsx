import { Package, ExternalLink, Boxes } from "lucide-react";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import Markdown from "react-markdown";
import "./RepositoryGeneralOverview.css";

// Try to extract dependency table from markdown text
function extractDeps(text: string): { name: string; version: string; type: "dep" | "dev" }[] | null {
    const deps: { name: string; version: string; type: "dep" | "dev" }[] = [];
    const lines = text.split("\n");
    let inDeps = false;
    let inDevDeps = false;

    for (const line of lines) {
        if (/dependencies/i.test(line) && !/dev/i.test(line)) { inDeps = true; inDevDeps = false; }
        if (/devdependencies/i.test(line)) { inDevDeps = true; inDeps = false; }

        // Match lines like: - **package-name**: `^1.2.3`  or  - **package**: "version"
        const match = line.match(/\*\*([^*]+)\*\*[^`"]*[`"]([^`"]+)[`"]/);
        if (match) {
            deps.push({
                name: match[1].trim(),
                version: match[2].trim(),
                type: inDevDeps ? "dev" : "dep"
            });
        }
    }
    return deps.length > 0 ? deps : null;
}

const KNOWN_URLS: Record<string, string> = {
    react: "https://react.dev",
    next: "https://nextjs.org",
    typescript: "https://www.typescriptlang.org",
    vite: "https://vite.dev",
    tailwindcss: "https://tailwindcss.com",
};

function pkgUrl(name: string): string | null {
    const lower = name.toLowerCase().replace(/^@[^/]+\//, "");
    return KNOWN_URLS[lower] ?? `https://www.npmjs.com/package/${name}`;
}

export default function RepositoryGeneralOverview({ state }: { state?: any }) {
    const data = useGithubRepoDataHook(state);

    if (!data?.packageJson) {
        return (
            <div className="rgo-empty">
                <Boxes size={40} strokeWidth={1.5} className="rgo-empty-icon" />
                <h3>Package Analysis</h3>
                <p>Analyze a repository to see dependency breakdown and package details.</p>
            </div>
        );
    }

    const deps = extractDeps(data.packageJson);

    return (
        <div className="rgo-root">
            {/* Header */}
            <div className="rgo-header">
                <div className="rgo-header-left">
                    <div className="rgo-icon-wrap">
                        <Package size={14} />
                    </div>
                    <span className="rgo-section-label">Package Analysis</span>
                </div>
                {deps && (
                    <span className="rgo-badge">
                        {deps.filter(d => d.type === "dep").length} deps ·{" "}
                        {deps.filter(d => d.type === "dev").length} devDeps
                    </span>
                )}
            </div>

            {/* Dependency table */}
            {deps ? (
                <div className="rgo-table-wrap">
                    <table className="rgo-table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th>Version</th>
                                <th>Type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {deps.map(dep => (
                                <tr key={dep.name} className="rgo-row">
                                    <td className="rgo-pkg-name">{dep.name}</td>
                                    <td>
                                        <code className="rgo-version">{dep.version}</code>
                                    </td>
                                    <td>
                                        <span className={`rgo-type-badge rgo-type-badge--${dep.type}`}>
                                            {dep.type === "dev" ? "dev" : "prod"}
                                        </span>
                                    </td>
                                    <td>
                                        <a
                                            href={pkgUrl(dep.name) ?? "#"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rgo-ext-link"
                                            title={`Open ${dep.name} on npm`}
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Fallback: markdown */
                <div className="rgo-markdown-fallback">
                    <Markdown>{data.packageJson}</Markdown>
                </div>
            )}
        </div>
    );
}
