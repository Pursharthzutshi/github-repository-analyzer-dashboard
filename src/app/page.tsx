'use client';

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import AnalyzeSearchInput from "../components/AnalyzeSearchInput"
import FileExplorer from "../components/HomePage/FileExplorer"
import GithubRepoOverview from "../components/HomePage/GithubRepoOverview"
import RepositoryInsights from "../components/HomePage/RepositoryInsights"
import SemanticSearch from "../components/HomePage/SemanticSearch"
import TechStack from "../components/HomePage/TechStack"
import BoxWrapper from "./box-wrapper"
import githubRepoAnalysis from "./(actions)/github-analysis"
import { getLatestAnalysisFromStorage, saveAnalysisToStorage } from "./lib/storage"
import "./home.css"
import RepositoryGeneralOverview from "../components/HomePage/RepositoryGeneralOverview"

export default function Home() {

    const initialState: any = {
        state: "",
        message: "",
        data: null
    }

    const [state, formAction, isPending] = useActionState(githubRepoAnalysis, initialState)
    const [displayState, setDisplayState] = useState(initialState)

    useEffect(() => {
        const latest = getLatestAnalysisFromStorage();
        if (latest) {
            setDisplayState(latest);
        }
    }, []);

    useEffect(() => {
        if (state && state.data) {
            setDisplayState(state);
            saveAnalysisToStorage({
                state: state.state,
                message: state.message,
                data: state.data,
                timestamp: Date.now()
            });
        }
    }, [state]);

    useEffect(() => {
        const handleCustomSelect = (e: any) => {
            if (e.detail) {
                setDisplayState(e.detail);
            }
        };
        window.addEventListener('select-analysis', handleCustomSelect);
        return () => window.removeEventListener('select-analysis', handleCustomSelect);
    }, []);

    return (
        <div className="home">

            <AnalyzeSearchInput state={displayState} formAction={formAction} isPending={isPending} />

            <div className="home-layout">
                <div className="home-main-content">
                    <BoxWrapper flex={2}>
                        <div className="home-page-box">
                            {isPending && (
                                <div className="home-box-loading-overlay">
                                    <Loader2 size={32} className="animate-spin" />
                                </div>
                            )}
                            <GithubRepoOverview state={displayState} />
                        </div>
                    </BoxWrapper>

                    <div className="home-page-box-container">

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                <FileExplorer state={displayState} />
                            </div>
                        </BoxWrapper>

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                Chat
                            </div>
                        </BoxWrapper>

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                <SemanticSearch />
                            </div>
                        </BoxWrapper>

                    </div>

                    <div className="home-page-box-container">

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                <RepositoryInsights state={displayState} />
                            </div>
                        </BoxWrapper>

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                <RepositoryGeneralOverview state={displayState} />
                            </div>
                        </BoxWrapper>

                        <BoxWrapper flex={1}>
                            <div className="home-page-box">
                                {isPending && (
                                    <div className="home-box-loading-overlay">
                                        <Loader2 size={32} className="animate-spin" />
                                    </div>
                                )}
                                {/* <RecentQuestions /> */}
                                <TechStack state={displayState} />
                            </div>
                        </BoxWrapper>

                    </div>
                </div>
            </div>

            {/* <div className="home-page-box-container">
                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        <OnboardingGuide state={displayState} />
                    </div>
                </BoxWrapper>
            </div> */}
        </div>
    )
}
