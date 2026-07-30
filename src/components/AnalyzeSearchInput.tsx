'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, ArrowRight, Loader2, AlertCircle, X } from 'lucide-react';
import './AnalyzeSearchInput.css';

function isValidGithubUrl(value: string): boolean {
    try {
        const url = new URL(value);
        if (url.hostname !== 'github.com') return false;
        const parts = url.pathname.split('/').filter(Boolean);
        return parts.length >= 2;
    } catch {
        return false;
    }
}

export default function AnalyzeSearchInput({ state, formAction, isPending }: { state: any, formAction: any, isPending?: boolean }) {
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showErrorMessage = (msg: string) => {
        setError(msg);
        setShowError(true);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setShowError(false), 5000);
    };

    const dismissError = () => {
        setShowError(false);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };

    useEffect(() => {
        if (state.data) {
            console.log("Parsed Data:", JSON.parse(state.data));
        } else {
            console.log("State:", state);
        }
    }, [state]);

    useEffect(() => {
        return () => {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem('github-repo-url') as HTMLInputElement;
        const value = input?.value?.trim();

        if (!value) {
            e.preventDefault();
            showErrorMessage('Please enter a GitHub repository URL.');
            return;
        }

        if (!isValidGithubUrl(value)) {
            e.preventDefault();
            showErrorMessage(
                'Invalid URL. Please enter a valid GitHub repo URL.\nExample: https://github.com/owner/repository'
            );
            return;
        }
    };

    return (
        <div className="search-wrapper-outer">
            <form action={formAction} className="search-wrapper" onSubmit={handleSubmit}>
                <div className={`search-container ${showError ? 'search-container--error' : ''}`}>
                    <Search size={22} className="search-icon" />
                    <input
                        name="github-repo-url"
                        type="text"
                        className="search-input"
                        placeholder="Enter GitHub Repo URL to analyze..."
                        autoComplete="off"
                        onChange={() => showError && dismissError()}
                    />
                    <button type="submit" className="search-button" disabled={isPending}>
                        <span>{isPending ? 'Analyzing...' : 'Analyze'}</span>
                        {isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <ArrowRight size={18} />
                        )}
                    </button>
                </div>
            </form>

            {/* Error Toast */}
            <div className={`url-error-toast ${showError ? 'url-error-toast--visible' : ''}`}>
                <AlertCircle size={16} className="url-error-toast__icon" />
                <span className="url-error-toast__text">{error}</span>
                <button className="url-error-toast__close" onClick={dismissError} aria-label="Dismiss">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}