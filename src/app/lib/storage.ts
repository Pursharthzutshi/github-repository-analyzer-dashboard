// Client-side only utility — NOT a server action
// This runs in the browser where localStorage is available.

const STORAGE_KEY = "latest_github_analysis";

export function saveAnalysisToStorage(data: { state: string; message: string; data: string; timestamp: number }) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save analysis", e);
    }
}

export function getLatestAnalysisFromStorage(): { state: string; message: string; data: string } | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                state: parsed.state,
                message: parsed.message,
                data: parsed.data,
            };
        }
        return null;
    } catch (e) {
        console.error("Failed to load latest analysis", e);
        return null;
    }
}
