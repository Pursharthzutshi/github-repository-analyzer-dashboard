import { useActionState, useEffect } from 'react';
import './AnalyzeSearchInput.css';
import githubRepoAnalysis from '../app/(actions)/github-analysis';

export default function AnalyzeSearchInput() {

        const initialState:any = {
            state:"",
            message:"",
            data:null
        }

        const [state,formAction] = useActionState(githubRepoAnalysis,initialState)

        useEffect(()=>{
            console.log(state)
        })

    return(
        <div className="search-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <form action={formAction}>
            <input  
                name="github-repo-url"
                type="text" 
                className="search-input" 
                placeholder="Enter GitHub Repo URL" 
            />
            <button className="search-button">
                Analyze
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
            </form>
        </div>
    )
}