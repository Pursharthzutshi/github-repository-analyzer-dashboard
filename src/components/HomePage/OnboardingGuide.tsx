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
    FileJson
} from "lucide-react";
import "./OnboardingGuide.css";

export default function OnboardingGuide() {
    return (
        <div className="og-root">
            {/* Page Header */}
            <div className="og-page-header">
                <div className="og-page-icon">
                    <BookOpen size={24} />
                </div>
                <div className="og-page-titles">
                    <h2>Onboarding Guide</h2>
                    <p>A quick guide to help you understand this repository.<br/>This guide is AI-generated and always up to date.</p>
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
                        Next.js is a React framework for building full-stack web applications.
                        It supports Server-Side Rendering (SSR), Static Site Generation (SSG),
                        API routes, and Server Components.
                    </p>
                    <div className="og-pills">
                        <span className="og-pill">React</span>
                        <span className="og-pill">TypeScript</span>
                        <span className="og-pill">Node.js</span>
                        <span className="og-pill">Tailwind CSS</span>
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
                        Next.js follows a hybrid architecture combining React, Node.js, and server-side rendering strategies.
                    </p>
                    
                    <div className="og-arch-flow">
                        {/* Node 1 */}
                        <div className="og-arch-node og-arch-node--client">
                            <Globe size={24} className="og-arch-icon" />
                            <h4>Client</h4>
                            <span>Browser<br/>(React)</span>
                        </div>

                        <ArrowRight className="og-arch-arrow" size={20} />

                        {/* Node 2 */}
                        <div className="og-arch-node og-arch-node--router">
                            <LayoutTemplate size={24} className="og-arch-icon" />
                            <h4>App Router</h4>
                            <span>Routing &<br/>Navigation</span>
                        </div>

                        <ArrowRight className="og-arch-arrow" size={20} />

                        {/* Node 3 */}
                        <div className="og-arch-node og-arch-node--server">
                            <Server size={24} className="og-arch-icon" />
                            <h4>Server Components</h4>
                            <span>Renders UI on<br/>the server</span>
                        </div>

                        <ArrowRight className="og-arch-arrow" size={20} />

                        {/* Node 4 */}
                        <div className="og-arch-node og-arch-node--api">
                            <Code2 size={24} className="og-arch-icon" />
                            <h4>API Routes</h4>
                            <span>Backend logic<br/>(Node.js)</span>
                        </div>

                        <ArrowRight className="og-arch-arrow" size={20} />

                        {/* Node 5 */}
                        <div className="og-arch-node og-arch-node--data">
                            <Database size={24} className="og-arch-icon" />
                            <h4>Data Layer</h4>
                            <span>Database /<br/>External Services</span>
                        </div>
                    </div>
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
                        {[
                            { name: "app/", desc: "Application routes using the App Router." },
                            { name: "packages/", desc: "Core framework packages and shared libraries." },
                            { name: "docs/", desc: "Official documentation source." },
                            { name: "examples/", desc: "Example projects and use cases." },
                            { name: "scripts/", desc: "Build, test and utility scripts." },
                            { name: "test/", desc: "End-to-end and unit tests." }
                        ].map(dir => (
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
                    <p className="og-desc-text">Follow these steps to get up and running.</p>
                    
                    <div className="og-steps-list">
                        {[
                            { title: "Read the README.md", desc: "Understand the project goals and features." },
                            { title: "Explore the project structure", desc: "Start with the app/ and packages/ directories." },
                            { title: "Understand routing", desc: "Check out app/ and routing-related files." },
                            { title: "Review data fetching", desc: "Look into fetch utilities and caching strategies." },
                            { title: "Run the project locally", desc: "pnpm install && pnpm dev", isCode: true }
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
                        {[
                            { name: "README.md", desc: "Project overview", icon: <FileText size={16}/> },
                            { name: "package.json", desc: "Dependencies & scripts", icon: <FileJson size={16}/> },
                            { name: "next.config.js", desc: "Next.js configuration", icon: <FileCode size={16}/> },
                            { name: "app/layout.tsx", desc: "Root layout", icon: <LayoutTemplate size={16}/> },
                            { name: "tsconfig.json", desc: "TypeScript config", icon: <FileJson size={16}/> }
                        ].map(file => (
                            <div className="og-file-card" key={file.name}>
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
