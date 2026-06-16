'use client';
import { useState, useRef, useEffect } from 'react';
import { GitBranch, Bell, User, History } from 'lucide-react';
import RecentAnalyses from './HomePage/RecentAnalyses';

export default function Navbar(){
    const [showRecent, setShowRecent] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowRecent(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <div className="navbar" style={{ position: "relative", zIndex: 50 }}>
            <div className="navbar-logo">
                <GitBranch size={28} className="text-primary" />
                <span className="logo-text">GitAnalyzer</span>
            </div>
            
            <div className="navbar-actions">
                <div ref={dropdownRef} style={{ position: "relative" }}>
                    <button 
                        className="icon-btn" 
                        aria-label="History" 
                        onClick={() => setShowRecent(!showRecent)}
                        style={{ background: showRecent ? 'var(--bg-card-hover)' : 'transparent' }}
                    >
                        <History size={20} />
                    </button>
                    {showRecent && (
                        <div style={{ position: "absolute", top: "120%", right: 0, width: "350px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px", boxShadow: "var(--shadow-xl)", maxHeight: "400px", overflowY: "auto" }}>
                            <RecentAnalyses onSelectAnalysis={(data) => {
                                window.dispatchEvent(new CustomEvent('select-analysis', { detail: data }));
                                setShowRecent(false);
                            }} />
                        </div>
                    )}
                </div>
                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={20} />
                </button>
                <div className="user-avatar" aria-label="User Profile">
                    <User size={20} />
                </div>
            </div>
        </div>
    )
}