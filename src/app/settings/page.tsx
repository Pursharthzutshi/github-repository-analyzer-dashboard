import React from 'react';
import { Save, Key, Palette, Sliders, Shield } from 'lucide-react';
import './Settings.css';

export default function SettingsPage() {
    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your preferences, keys, and default behaviors.</p>
            </div>

            <div className="settings-grid">
                {/* Authentication / API Keys Section */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <Key size={20} />
                        </div>
                        <h2>Authentication</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="github-token">GitHub Personal Access Token</label>
                            <p className="help-text">Adding a token increases your API rate limit.</p>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    id="github-token" 
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                                    className="settings-input"
                                />
                                <button className="btn-primary">Save Token</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Preferences Section */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <Palette size={20} />
                        </div>
                        <h2>Appearance</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label>Theme Preference</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="theme" value="light" defaultChecked />
                                    <span className="radio-text">Light</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="theme" value="dark" />
                                    <span className="radio-text">Dark</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="theme" value="system" />
                                    <span className="radio-text">System</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Defaults Section */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <Sliders size={20} />
                        </div>
                        <h2>Analysis Defaults</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span className="checkbox-text">Automatically fetch latest Pull Requests</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span className="checkbox-text">Analyze top contributor stats</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span className="checkbox-text">Include deep dependency tree scan (Slower)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="settings-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <Shield size={20} />
                        </div>
                        <h2>Privacy & Data</h2>
                    </div>
                    <div className="card-content">
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span className="checkbox-text">Save analysis history locally</span>
                            </label>
                        </div>
                        <button className="btn-outline-danger mt-3">Clear Analysis History</button>
                    </div>
                </div>
            </div>
            
            <div className="settings-actions">
                <button className="btn-primary large-btn">
                    <Save size={18} />
                    Save All Settings
                </button>
            </div>
        </div>
    );
}
