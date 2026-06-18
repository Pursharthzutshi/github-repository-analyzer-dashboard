import { useEffect } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import './AnalyzeSearchInput.css';

export default function AnalyzeSearchInput({ state, formAction, isPending }: { state: any, formAction: any, isPending?: boolean }) {

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
                <button type="submit" className="search-button" disabled={isPending}>
                    <span>{isPending ? "Analyzing..." : "Analyze"}</span>
                    {isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <ArrowRight size={18} />
                    )}
                </button>
            </div>
        </form>
    )
}