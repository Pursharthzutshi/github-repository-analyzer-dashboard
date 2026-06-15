import { useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import './AnalyzeSearchInput.css';

export default function AnalyzeSearchInput({ state, formAction }: { state: any, formAction: any }) {

    useEffect(() => {
        if (state.data) {
            console.log("Parsed Data:", JSON.parse(state.data));
        } else {
            console.log("State:", state);
        }
    }, [state])

    return (
        <form action={formAction} className="search-wrapper">
            <div className="search-container">
                <Search size={22} className="search-icon" />
                <input
                    name="github-repo-url"
                    type="text"
                    className="search-input"
                    placeholder="Enter GitHub Repo URL to analyze..."
                    autoComplete="off"
                />
                <button type="submit" className="search-button">
                    <span>Analyze</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </form>
    )
}