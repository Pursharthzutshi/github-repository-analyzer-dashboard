import { Home, FolderGit2, BarChart2, Settings, HelpCircle, BookOpen } from 'lucide-react';

interface LeftsidebarProps {
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Leftsidebar({ activePage = 'home', onNavigate }: LeftsidebarProps){
    return(
        <div className="left-sidebar">
            <div className="nav-items">
                <button 
                    className={`nav-item ${activePage === 'home' ? 'active' : ''}`} 
                    aria-label="Home"
                    onClick={() => onNavigate?.('home')}
                >
                    <Home size={24} />
                </button>
                <button 
                    className={`nav-item ${activePage === 'repositories' ? 'active' : ''}`} 
                    aria-label="Repositories"
                    onClick={() => onNavigate?.('repositories')}
                >
                    <FolderGit2 size={24} />
                </button>
                <button className="nav-item" aria-label="Analytics">
                    <BarChart2 size={24} />
                </button>
                <button 
                    className={`nav-item ${activePage === 'onboarding' ? 'active' : ''}`} 
                    aria-label="Onboarding Guide"
                    onClick={() => onNavigate?.('onboarding')}
                >
                    <BookOpen size={24} />
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