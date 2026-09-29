import { getAllDetailedAnalysis } from '../lib/models/analysis';
import { 
    Activity, 
    Users, 
    Star, 
    GitFork, 
    TrendingUp, 
    Clock, 
    Code2,
    GitPullRequest,
    FolderGit2
} from 'lucide-react';
import './Analytics.css';

// Helper to fetch repo details from Github API with caching
async function fetchGithubRepoData(repoName: string) {
    try {
        const headers: any = {};
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }
        
        const [repoRes, langsRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${repoName}`, { headers, next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/repos/${repoName}/languages`, { headers, next: { revalidate: 3600 } })
        ]);

        if (!repoRes.ok || !langsRes.ok) return null;
        
        const repoData = await repoRes.json();
        const langsData = await langsRes.json();
        
        return {
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            languages: langsData
        };
    } catch (e) {
        return null;
    }
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

export default async function AnalyticsPage() {
    const data = await getAllDetailedAnalysis();
    const totalRepos = data.length;
    
    // Sort by most recent
    const sortedData = [...data].sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime());
    
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const recentActivity = await Promise.all(sortedData.slice(0, 20).map(async (repo) => {
        // Try to extract a repo name from the URL
        let repoName = repo.repo_url;
        try {
            const urlParts = new URL(repo.repo_url).pathname.split('/').filter(Boolean);
            if (urlParts.length >= 2) {
                repoName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
            }
        } catch (e) {
            // Ignore invalid URL
        }

        const stats = await fetchGithubRepoData(repoName);
        if (stats) {
            totalStars += stats.stars;
            totalForks += stats.forks;
            
            // Aggregate languages
            Object.entries(stats.languages).forEach(([lang, bytes]) => {
                languageCounts[lang] = (languageCounts[lang] || 0) + (bytes as number);
            });
        }

        return {
            repo: repoName,
            status: "Completed",
            time: new Date(repo.analyzed_at).toLocaleDateString(),
            metric: stats ? `${formatNumber(stats.stars)} stars` : "Analysis complete"
        };
    }));

    // Calculate Top Languages
    const totalLanguageBytes = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, bytes]) => ({
            name,
            percentage: totalLanguageBytes > 0 ? Math.round((bytes / totalLanguageBytes) * 100) : 0,
            className: name.toLowerCase().replace(/[^a-z0-9]/g, '')
        }));


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
                        <div className="stat-value">{totalRepos}</div>
                        <div className="stat-trend positive">
                            <TrendingUp size={14} />
                            <span>Up to date</span>
                        </div>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon-wrapper star">
                        <Star size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Stars Tracked</h3>
                        <div className="stat-value">{formatNumber(totalStars)}</div>
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
                        <div className="stat-value">{formatNumber(totalForks)}</div>
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
                {/* Languages Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <Code2 size={20} className="chart-icon" />
                            <h2>Top Languages</h2>
                        </div>
                    </div>
                    <div className="chart-content language-distribution">
                        {topLanguages.length > 0 ? topLanguages.map((lang, idx) => (
                            <div key={idx} className="lang-bar">
                                <div className="lang-info">
                                    <span className="lang-name">{lang.name}</span>
                                    <span className="lang-pct">{lang.percentage}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${lang.percentage}%`, backgroundColor: `hsl(${idx * 60 + 200}, 70%, 50%)` }}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data-message">
                                <p>Not enough language data available yet.</p>
                            </div>
                        )}
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
                    {recentActivity.slice(0, 5).map((item, idx) => (
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
                    {recentActivity.length === 0 && (
                        <div className="activity-row">
                            <div className="activity-repo">No recent activity</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
