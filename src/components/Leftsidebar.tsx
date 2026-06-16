'use client';

import { Home, FolderGit2, BarChart2, Settings, HelpCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActionState } from 'react';
import { testDB } from '../app/(actions)/github-analysis';

export default function Leftsidebar() {
    const pathname = usePathname();
    const initialState: any = {
        state: "",
        message: "",
        data: null
    }
    const [state, formAction] = useActionState(testDB, initialState)

    return (
        <div className="left-sidebar">
            <div className="nav-items">
                <Link href="/">
                    <button
                        className={`nav-item ${pathname === '/' ? 'active' : ''}`}
                        aria-label="Home"
                    >
                        <Home size={24} />
                    </button>
                </Link>
                <Link href="/repositories">
                    <button
                        className={`nav-item ${pathname === '/repositories' ? 'active' : ''}`}
                        aria-label="Repositories"
                    >
                        <FolderGit2 size={24} />
                    </button>
                </Link>
                <button className="nav-item" aria-label="Analytics">
                    <BarChart2 size={24} />
                </button>
                <Link href="/onboarding">
                    <button
                        className={`nav-item ${pathname === '/onboarding' ? 'active' : ''}`}
                        aria-label="Onboarding Guide"
                    >
                        <BookOpen size={24} />
                    </button>
                </Link>
            </div>
            
            <div className="nav-items bottom-items">
                <button className="nav-item" aria-label="Help">
                    <HelpCircle size={24} />
                </button>
                <form action={formAction}>
                    <button type='submit' className="nav-item" aria-label="Settings">
                        <Settings size={24} />
                    </button>
                </form>
            </div>
        </div>
    )
}