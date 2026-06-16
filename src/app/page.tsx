'use client';

import { useActionState, useEffect, useState } from "react"
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

    const [state, formAction] = useActionState(githubRepoAnalysis, initialState)
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

    return (
        <div className="home">

            <AnalyzeSearchInput state={displayState} formAction={formAction} />

            <BoxWrapper flex={2}>
                <div className="home-page-box">
                    <GithubRepoOverview state={displayState} />
                </div>
            </BoxWrapper>

            <div className="home-page-box-container">

                <BoxWrapper flex={2}>
                    <div className="home-page-box">
                        <FileExplorer state={displayState} />
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        Chat
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        <SemanticSearch />
                    </div>
                </BoxWrapper>

            </div>

            <div className="home-page-box-container">

                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        <RepositoryInsights state={displayState} />
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={2}>
                    <div className="home-page-box">
                        <RepositoryGeneralOverview state={displayState} />
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        {/* <RecentQuestions /> */}
                        <TechStack state={displayState} />
                    </div>
                </BoxWrapper>

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

