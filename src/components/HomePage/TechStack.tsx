import React from "react";
import { Code2 } from "lucide-react";
import useGithubRepoDataHook from "./useGithubRepoDataHook";
import "./TechStack.css";

const TECH_ICONS: Record<string, string> = {
    typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    "tailwind css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    next: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
};

function getTechIcon(name: string) {
    const key = name.toLowerCase();
    if (TECH_ICONS[key]) return TECH_ICONS[key];
    if (key === "tailwindcss") return TECH_ICONS["tailwind css"];
    if (key === "next.js") return TECH_ICONS["next"];
    if (key === "node") return TECH_ICONS["node.js"];
    return null;
}

function formatTechName(name: string) {
    const map: Record<string, string> = {
        react: "React",
        "react-dom": "React",
        next: "Next.js",
        tailwindcss: "Tailwind CSS",
        typescript: "TypeScript",
        javascript: "JavaScript",
        "node.js": "Node.js",
        vue: "Vue.js",
        svelte: "Svelte",
    };
    return map[name.toLowerCase()] || name;
}

export default function TechStack({ state }: { state?: any }) {
    const githubRepoData = useGithubRepoDataHook(state);

    let langs: { language: string; percentage: number }[] = [];
    if (githubRepoData?.languages) {
        try { langs = JSON.parse(githubRepoData.languages); } catch { /* ignore */ }
    }

    let deps: string[] = [];
    if (githubRepoData?.packageJson) {
        const lines = githubRepoData.packageJson.split("\n");
        for (const line of lines) {
            const match = line.match(/\*\*([^*]+)\*\*/);
            if (match) {
                deps.push(match[1].trim());
            }
        }
    }

    const combinedTech = new Set<string>();
    langs.slice(0, 3).forEach(l => combinedTech.add(l.language));
    
    const priority = ["react", "next", "tailwindcss", "vue", "svelte", "express", "node", "docker"];
    deps.forEach(d => {
        if (priority.includes(d.toLowerCase())) {
            combinedTech.add(formatTechName(d));
        }
    });

    if (combinedTech.size === 0) {
        return (
            <div className="ts-empty">
                <div className="ts-empty-icon-wrap">
                    <Code2 size={24} strokeWidth={1.5} />
                </div>
                <h3 className="ts-empty-title">Tech Stack</h3>
                <p className="ts-empty-desc">Analyze a repository to see its tech stack.</p>
            </div>
        );
    }

    const techList = Array.from(combinedTech).slice(0, 5);
    const extraCount = combinedTech.size > 5 ? combinedTech.size - 5 : 0;

    return (
        <div className="ts-root">
            <div className="ts-header">
                <span className="ts-header-label">Tech Stack</span>
            </div>

            <div className="ts-body-list">
                {techList.map((tech) => {
                    const iconUrl = getTechIcon(tech);
                    return (
                        <div className="ts-item" key={tech}>
                            {iconUrl ? (
                                <img src={iconUrl} alt={tech} className="ts-item-icon" />
                            ) : (
                                <div className="ts-item-icon-fallback">
                                    <Code2 size={12} />
                                </div>
                            )}
                            <span className="ts-item-name">{tech}</span>
                        </div>
                    );
                })}
            </div>
            
            {extraCount > 0 && (
                <div className="ts-more-badge">
                    +{extraCount} more
                </div>
            )}
        </div>
    );
}
