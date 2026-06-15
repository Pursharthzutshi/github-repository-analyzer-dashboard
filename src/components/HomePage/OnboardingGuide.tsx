import { 
    BookOpen, 
    FileText, 
    Network, 
    Folder, 
    Rocket, 
    FileCode, 
    Lightbulb,
    Globe,
    LayoutTemplate,
    Server,
    Code2,
    Database,
    ArrowRight,
    ChevronRight,
    FileJson,
    Terminal
} from "lucide-react";
import "./OnboardingGuide.css";
import useGithubRepoDataHook from "./useGithubRepoDataHook";

export default function OnboardingGuide({ state }: { state?: any }) {
    const data = useGithubRepoDataHook(state);

    if (!data?.tree || !data?.packageJson) {
        return (
            <div className="og-root og-empty">
                <BookOpen size={48} strokeWidth={1.5} className="og-empty-icon" />
                <h3>Custom Onboarding Guide</h3>
                <p>Analyze a repository above to instantly generate a custom, AI-powered onboarding guide.</p>
            </div>
        );
    }

    // 1. Parse insights for description
    let description = "A GitHub repository analyzed dynamically.";
    try {
        if (data.insights) {
            const parsedInsights = JSON.parse(data.insights);
            if (parsedInsights.description) description = parsedInsights.description;
        }
    } catch {}

    // 2. Parse languages for pills
    let topLangs: string[] = [];
    try {
        if (data.languages) {
            const parsedLangs = JSON.parse(data.languages);
            topLangs = parsedLangs.slice(0, 4).map((l: any) => l.language);
        }
    } catch {}

    if (topLangs.length === 0) topLangs = ["Code", "Markdown"];

    // 3. Parse tree for directories and files
    const treeText = data.tree || "";
    const treeLines = treeText.split("\n");
    const topDirs = new Set<string>();
    const rootFiles = new Set<string>();

    for (const line of treeLines) {
        if (!line.trim()) continue;
        const parts = line.split("/");
        if (parts.length === 1) {
            rootFiles.add(parts[0].toLowerCase());
            rootFiles.add(parts[0]); // Keep original case too
        } else {
            topDirs.add(parts[0]);
        }
    }

    const dirList = Array.from(topDirs).slice(0, 6).map(dir => ({
        name: dir + "/",
        desc: `Main source directory for ${dir}`
    }));

    if (dirList.length === 0) {
        dirList.push({ name: "src/", desc: "Source files" });
    }

    // 4. Parse package.json for commands and architecture
    const pkgText = data.packageJson || "";
    const isNext = /"next":/i.test(pkgText);
    const isReact = /"react":/i.test(pkgText);
    const isExpress = /"express":/i.test(pkgText);

    // Guess install command
    let installCmd = "npm install";
    if (rootFiles.has("yarn.lock")) installCmd = "yarn install";
    else if (rootFiles.has("pnpm-lock.yaml")) installCmd = "pnpm install";

    // Guess run command
    let runCmd = "npm start";
    if (pkgText.includes('"dev":')) {
        if (installCmd.startsWith("yarn")) runCmd = "yarn dev";
        else if (installCmd.startsWith("pnpm")) runCmd = "pnpm dev";
        else runCmd = "npm run dev";
    }

    // 5. Architecture logic
    const renderArchitecture = () => {
        if (isNext) {
            return (
                <div className="og-arch-flow">
                    <div className="og-arch-node og-arch-node--client"><Globe size={24} className="og-arch-icon" /><h4>Client</h4><span>Browser (React)</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--router"><LayoutTemplate size={24} className="og-arch-icon" /><h4>App Router</h4><span>Next.js</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--server"><Server size={24} className="og-arch-icon" /><h4>Server</h4><span>SSR / API</span></div>
                </div>
            );
        } else if (isReact) {
            return (
                <div className="og-arch-flow">
                    <div className="og-arch-node og-arch-node--client"><Globe size={24} className="og-arch-icon" /><h4>Client</h4><span>React SPA</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--router"><LayoutTemplate size={24} className="og-arch-icon" /><h4>Bundler</h4><span>Vite / Webpack</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--api"><Code2 size={24} className="og-arch-icon" /><h4>Static Build</h4><span>dist/build</span></div>
                </div>
            );
        } else if (isExpress) {
            return (
                <div className="og-arch-flow">
                    <div className="og-arch-node og-arch-node--client"><Globe size={24} className="og-arch-icon" /><h4>API Consumer</h4><span>Web / Mobile</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--server"><Server size={24} className="og-arch-icon" /><h4>Express Server</h4><span>Node.js</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--data"><Database size={24} className="og-arch-icon" /><h4>Data Layer</h4><span>DB / Services</span></div>
                </div>
            );
        } else {
            return (
                <div className="og-arch-flow">
                    <div className="og-arch-node og-arch-node--client"><Code2 size={24} className="og-arch-icon" /><h4>Source Code</h4><span>Main logic</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--router"><Terminal size={24} className="og-arch-icon" /><h4>CLI / Engine</h4><span>Execution</span></div>
                </div>
            );
        }
    };

    // 6. Important Files logic
    const possibleFiles = [
        { name: "README.md", desc: "Project overview", icon: <FileText size={16}/> },
        { name: "package.json", desc: "Dependencies & scripts", icon: <FileJson size={16}/> },
        { name: "next.config.js", desc: "Next.js configuration", icon: <FileCode size={16}/> },
        { name: "next.config.mjs", desc: "Next.js configuration", icon: <FileCode size={16}/> },
        { name: "vite.config.ts", desc: "Vite config", icon: <FileCode size={16}/> },
        { name: "tsconfig.json", desc: "TypeScript config", icon: <FileJson size={16}/> },
        { name: "docker-compose.yml", desc: "Docker setup", icon: <Server size={16}/> },
        { name: "Dockerfile", desc: "Container specs", icon: <Server size={16}/> }
    ];

    const foundFiles = possibleFiles.filter(f => rootFiles.has(f.name) || rootFiles.has(f.name.toLowerCase()));
    
    if (foundFiles.length === 0) {
        foundFiles.push({ name: "Source Code", desc: "Main project files", icon: <FileCode size={16}/> });
    }

    return (
        <div className="og-root">
            {/* Page Header */}
            <div className="og-page-header">
                <div className="og-page-icon">
                    <BookOpen size={24} />
                </div>
                <div className="og-page-titles">
                    <h2>Onboarding Guide</h2>
                    <p>A dynamically generated guide to help you understand this repository.<br/>Based on actual files, dependencies, and metadata.</p>
                </div>
            </div>

            {/* 1. Project Summary */}
            <div className="og-section">
                <div className="og-section-header">
                    <div className="og-section-icon"><FileText size={18} /></div>
                    <h3>1. Project Summary</h3>
                </div>
                <div className="og-section-content">
                    <p className="og-summary-text">
                        {description}
                    </p>
                    <div className="og-pills">
                        {topLangs.map((lang, i) => (
                            <span key={i} className="og-pill">{lang}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Architecture Overview */}
            <div className="og-section">
                <div className="og-section-header">
                    <div className="og-section-icon"><Network size={18} /></div>
                    <h3>2. Architecture Overview</h3>
                </div>
                <div className="og-section-content">
                    <p className="og-desc-text">
                        Inferred architecture based on detected framework dependencies.
                    </p>
                    {renderArchitecture()}
                </div>
            </div>

            {/* 3. Repository Structure */}
            <div className="og-section">
                <div className="og-section-header">
                    <div className="og-section-icon"><Folder size={18} /></div>
                    <h3>3. Repository Structure</h3>
                </div>
                <div className="og-section-content">
                    <p className="og-desc-text">High-level overview of the important directories in this repository.</p>
                    
                    <div className="og-folder-list">
                        {dirList.map(dir => (
                            <div className="og-folder-row" key={dir.name}>
                                <div className="og-folder-left">
                                    <Folder size={16} className="og-folder-icon" />
                                    <span className="og-folder-name">{dir.name}</span>
                                </div>
                                <span className="og-folder-desc">{dir.desc}</span>
                                <ChevronRight size={14} className="og-folder-arrow" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Getting Started */}
            <div className="og-section">
                <div className="og-section-header">
                    <div className="og-section-icon"><Rocket size={18} /></div>
                    <h3>4. Getting Started</h3>
                </div>
                <div className="og-section-content">
                    <p className="og-desc-text">Follow these steps to get up and running based on this repo's configuration.</p>
                    
                    <div className="og-steps-list">
                        {[
                            { title: "Read the README", desc: "Understand the project goals." },
                            { title: "Install Dependencies", desc: installCmd, isCode: true },
                            { title: "Run the Project", desc: runCmd, isCode: true }
                        ].map((step, idx) => (
                            <div className="og-step-row" key={idx}>
                                <div className="og-step-number">{idx + 1}</div>
                                <div className="og-step-content">
                                    <span className="og-step-title">{step.title}</span>
                                    {step.isCode ? (
                                        <code className="og-step-code">{step.desc}</code>
                                    ) : (
                                        <span className="og-step-desc">{step.desc}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Important Files */}
            <div className="og-section">
                <div className="og-section-header">
                    <div className="og-section-icon"><FileCode size={18} /></div>
                    <h3>5. Important Files to Know</h3>
                </div>
                <div className="og-section-content">
                    <p className="og-desc-text">Key files you should look at first.</p>
                    
                    <div className="og-files-grid">
                        {foundFiles.map((file, i) => (
                            <div className="og-file-card" key={i}>
                                <div className="og-file-header">
                                    {file.icon}
                                    <span className="og-file-name">{file.name}</span>
                                </div>
                                <span className="og-file-desc">{file.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tip Footer */}
            <div className="og-footer-tip">
                <Lightbulb size={16} className="og-tip-icon" />
                <span><strong>Tip:</strong> Use the <strong>AI Chat</strong> or <strong>File Explorer</strong> to dive deeper into any part of the codebase.</span>
            </div>

        </div>
    );
}
