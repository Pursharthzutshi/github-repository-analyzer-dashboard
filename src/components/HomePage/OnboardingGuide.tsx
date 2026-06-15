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

    // Data is available when any meaningful field exists
    const hasData = data && (data.tree || data.packageJson || data.insights || data.languages);

    if (!hasData) {
        return (
            <div className="og-root og-empty">
                <BookOpen size={48} strokeWidth={1.5} className="og-empty-icon" />
                <h3>Custom Onboarding Guide</h3>
                <p>Analyze a repository above to instantly generate a custom, AI-powered onboarding guide.</p>
            </div>
        );
    }

    // 1. Parse insights for description (insights is raw JSON from the API)
    let description = "A GitHub repository analyzed dynamically.";
    try {
        if (data.insights) {
            const parsedInsights = JSON.parse(data.insights);
            if (parsedInsights.description) description = parsedInsights.description;
        }
    } catch {}

    // 2. Parse languages for pills (languages is raw JSON from the API)
    let topLangs: string[] = [];
    try {
        if (data.languages) {
            const parsedLangs = JSON.parse(data.languages);
            topLangs = parsedLangs.slice(0, 4).map((l: any) => l.language);
        }
    } catch {}

    if (topLangs.length === 0) topLangs = ["Code", "Markdown"];

    // 3. Parse tree for directories
    //    NOTE: data.tree is LLM-generated markdown, not raw paths.
    //    We look for folder-like patterns: lines containing "/" or ending with "/"
    //    or lines that look like directory names in markdown (e.g., `src/`, **app/**)
    const treeText = data.tree || "";
    const topDirs = new Set<string>();
    const rootFiles = new Set<string>();

    // Try to extract folder names from markdown tree output
    const folderPatterns = treeText.match(/(?:^|\s|`|\/|\*\*)([\w.-]+)\//gm) || [];
    for (const match of folderPatterns) {
        const dirName = match.replace(/^[\s`/*]+/, "").replace(/\/.*$/, "").trim();
        if (dirName && dirName.length > 1 && dirName.length < 40 && !dirName.startsWith(".")) {
            topDirs.add(dirName);
        }
    }

    // Extract root file names from markdown (e.g., `package.json`, `tsconfig.json`)
    const filePatterns = treeText.match(/`([\w.-]+\.\w+)`/g) || [];
    for (const match of filePatterns) {
        const fileName = match.replace(/`/g, "").trim();
        if (fileName) {
            rootFiles.add(fileName);
            rootFiles.add(fileName.toLowerCase());
        }
    }

    // Also check for common file names mentioned without backticks
    const commonFiles = ["README.md", "package.json", "tsconfig.json", "next.config.js", "next.config.mjs",
        "vite.config.ts", "docker-compose.yml", "Dockerfile", "yarn.lock", "pnpm-lock.yaml", ".env"];
    for (const file of commonFiles) {
        if (treeText.includes(file)) {
            rootFiles.add(file);
            rootFiles.add(file.toLowerCase());
        }
    }

    const dirList = Array.from(topDirs).slice(0, 6).map(dir => ({
        name: dir + "/",
        desc: `Main source directory for ${dir}`
    }));

    if (dirList.length === 0) {
        dirList.push({ name: "src/", desc: "Source files" });
    }

    // 4. Detect framework from packageJson (which is LLM-generated markdown) AND tree text
    //    Use broad text matching instead of strict JSON regex
    const allText = (data.packageJson || "") + " " + (data.tree || "");
    const isNext = /next\.?js|next\.config|"next"/i.test(allText);
    const isReact = /react|"react"/i.test(allText);
    const isExpress = /express\.?js|"express"/i.test(allText);
    const isVue = /vue\.?js|"vue"/i.test(allText);

    // Guess install command
    let installCmd = "npm install";
    if (rootFiles.has("yarn.lock") || allText.includes("yarn.lock")) installCmd = "yarn install";
    else if (rootFiles.has("pnpm-lock.yaml") || allText.includes("pnpm-lock")) installCmd = "pnpm install";

    // Guess run command
    let runCmd = "npm start";
    if (allText.includes("dev") && (allText.includes("script") || allText.includes('"dev"'))) {
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
        } else if (isVue) {
            return (
                <div className="og-arch-flow">
                    <div className="og-arch-node og-arch-node--client"><Globe size={24} className="og-arch-icon" /><h4>Client</h4><span>Vue.js SPA</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--router"><LayoutTemplate size={24} className="og-arch-icon" /><h4>Vue Router</h4><span>SFC Components</span></div>
                    <ArrowRight className="og-arch-arrow" size={20} />
                    <div className="og-arch-node og-arch-node--api"><Code2 size={24} className="og-arch-icon" /><h4>Static Build</h4><span>dist/build</span></div>
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

    // Match files found in tree text (either via regex or simple includes)
    const foundFiles = possibleFiles.filter(f => 
        rootFiles.has(f.name) || rootFiles.has(f.name.toLowerCase()) || allText.includes(f.name)
    );
    
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
