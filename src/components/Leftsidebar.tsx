import { Home, FolderGit2, BarChart2, Settings, HelpCircle } from 'lucide-react';

export default function Leftsidebar(){
    return(
        <div className="left-sidebar">
            <div className="nav-items">
                <button className="nav-item active" aria-label="Home">
                    <Home size={24} />
                </button>
                <button className="nav-item" aria-label="Repositories">
                    <FolderGit2 size={24} />
                </button>
                <button className="nav-item" aria-label="Analytics">
                    <BarChart2 size={24} />
                </button>
            </div>
            
            <div className="nav-items bottom-items">
                <button className="nav-item" aria-label="Help">
                    <HelpCircle size={24} />
                </button>
                <button className="nav-item" aria-label="Settings">
                    <Settings size={24} />
                </button>
            </div>
        </div>
    )
}