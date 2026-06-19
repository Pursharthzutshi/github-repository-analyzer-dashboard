import React from 'react';
import { 
    Activity, 
    Users, 
    Star, 
    GitFork, 
    TrendingUp, 
    Clock, 
    Code2,
    GitPullRequest
} from 'lucide-react';
import './Analytics.css';

export default function AnalyticsPage() {
    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>Global Analytics</h1>
                <p>Aggregated metrics and insights across all your analyzed repositories.</p>
            </div>

            {/* Top Level Stats */}
            <div className="stats-grid">
                <div className="stat-card highlight">
                    <div className="stat-icon-wrapper">
                        <Activity size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Repos Analyzed</h3>
                        <div className="stat-value">24</div>
                        <div className="stat-trend positive">
                            <TrendingUp size={14} />
                            <span>+3 this week</span>
                        </div>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon-wrapper star">
                        <Star size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Stars Tracked</h3>
                        <div className="stat-value">145.2k</div>
                        <div className="stat-trend">
                            <span>Across all repos</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper fork">
                        <GitFork size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Forks Tracked</h3>
                        <div className="stat-value">28.4k</div>
                        <div className="stat-trend">
                            <span>Across all repos</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper pr">
                        <GitPullRequest size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Avg. PR Merge Time</h3>
                        <div className="stat-value">1.2 Days</div>
                        <div className="stat-trend positive">
                            <TrendingUp size={14} />
                            <span>-12% from last month</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Languages Chart (Mockup) */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <Code2 size={20} className="chart-icon" />
                            <h2>Top Languages</h2>
                        </div>
                    </div>
                    <div className="chart-content language-distribution">
                        <div className="lang-bar">
                            <div className="lang-info">
                                <span className="lang-name">TypeScript</span>
                                <span className="lang-pct">45%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill ts" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div className="lang-bar">
                            <div className="lang-info">
                                <span className="lang-name">JavaScript</span>
                                <span className="lang-pct">25%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill js" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div className="lang-bar">
                            <div className="lang-info">
                                <span className="lang-name">Python</span>
                                <span className="lang-pct">15%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill py" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                        <div className="lang-bar">
                            <div className="lang-info">
                                <span className="lang-name">Go</span>
                                <span className="lang-pct">10%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill go" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                        <div className="lang-bar">
                            <div className="lang-info">
                                <span className="lang-name">Other</span>
                                <span className="lang-pct">5%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill other" style={{ width: '5%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Repository Health Pie Chart (Mockup) */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <Activity size={20} className="chart-icon" />
                            <h2>Repository Health</h2>
                        </div>
                    </div>
                    <div className="chart-content pie-chart-container">
                        <svg width="160" height="160" viewBox="0 0 42 42" className="donut-chart">
                            {/* Hole and Base (optional background ring) */}
                            <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--border-color)" strokeWidth="4"></circle>
                            
                            {/* Active: 65% */}
                            <circle className="donut-segment active" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="65 35" strokeDashoffset="25"></circle>
                            
                            {/* Maintenance: 25% */}
                            <circle className="donut-segment maintenance" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-40"></circle>
                            
                            {/* Archived: 10% */}
                            <circle className="donut-segment archived" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#94a3b8" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="-65"></circle>

                            {/* Center Text */}
                            <g className="chart-text">
                                <text x="50%" y="48%" className="chart-number">100%</text>
                                <text x="50%" y="58%" className="chart-label">Health</text>
                            </g>
                        </svg>
                        <div className="pie-legend">
                            <div className="legend-item">
                                <span className="legend-color active-color"></span>
                                <span className="legend-label">Active (65%)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color maintenance-color"></span>
                                <span className="legend-label">Maintenance (25%)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color archived-color"></span>
                                <span className="legend-label">Archived (10%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Most Active Contributors (Mockup) */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <Users size={20} className="chart-icon" />
                            <h2>Top Contributors Across Repos</h2>
                        </div>
                    </div>
                    <div className="chart-content contributor-list">
                        {[
                            { name: "Sarah Drasner", commits: 1432, repos: 3 },
                            { name: "Dan Abramov", commits: 984, repos: 2 },
                            { name: "Guillermo Rauch", commits: 845, repos: 4 },
                            { name: "Lee Robinson", commits: 620, repos: 3 },
                        ].map((user, idx) => (
                            <div key={idx} className="contributor-item">
                                <div className="contributor-avatar">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="contributor-details">
                                    <h4>{user.name}</h4>
                                    <p>Active in {user.repos} repos</p>
                                </div>
                                <div className="contributor-stats">
                                    <span className="commit-count">{user.commits}</span>
                                    <span className="commit-label">commits</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="recent-activity-section">
                <div className="chart-header">
                    <div className="chart-title">
                        <Clock size={20} className="chart-icon" />
                        <h2>Recent Analyses</h2>
                    </div>
                </div>
                <div className="activity-list">
                    {[
                        { repo: "facebook/react", status: "Completed", time: "2 hours ago", metric: "198k stars" },
                        { repo: "vercel/next.js", status: "Completed", time: "5 hours ago", metric: "112k stars" },
                        { repo: "tailwindlabs/tailwindcss", status: "Completed", time: "1 day ago", metric: "74k stars" },
                    ].map((item, idx) => (
                        <div key={idx} className="activity-row">
                            <div className="activity-repo">
                                <FolderGit2 size={18} className="activity-repo-icon" />
                                <span>{item.repo}</span>
                            </div>
                            <div className="activity-metric">{item.metric}</div>
                            <div className="activity-status success">{item.status}</div>
                            <div className="activity-time">{item.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Just importing an extra icon needed locally in the file since we used it in the map
import { FolderGit2 } from 'lucide-react';
