import { GitBranch, Bell, User } from 'lucide-react';

export default function Navbar(){
    return(
        <div className="navbar">
            <div className="navbar-logo">
                <GitBranch size={28} className="text-primary" />
                <span className="logo-text">GitAnalyzer</span>
            </div>
            
            <div className="navbar-actions">
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