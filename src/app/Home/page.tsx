import { useActionState } from "react"
import AnalyzeSearchInput from "../../components/AnalyzeSearchInput"
import FileExplorer from "../../components/HomePage/FileExplorer"
import GithubRepoOverview from "../../components/HomePage/GithubRepoOverview"
import OnBoardingGuide from "../../components/HomePage/OnBoardingGude"
import RecentQuestions from "../../components/HomePage/RecentQuestions"
import RepositoryInsights from "../../components/HomePage/RepositoryInsights"
import SemanticSearch from "../../components/HomePage/SemanticSearch"
import BoxWrapper from "./box-wrapper"
import "./home.css"
import githubRepoAnalysis from "../(actions)/github-analysis"

export default function Home() {

    const initialState: any = {
        state: "",
        message: "",
        data: null
    }

    const [state, formAction] = useActionState(githubRepoAnalysis, initialState)

    return (
        <div className="home">

            <AnalyzeSearchInput state={state} formAction={formAction} />

            <BoxWrapper flex={2}>
                <div className="home-page-box">
                    <GithubRepoOverview state={state} />
                </div>
            </BoxWrapper>

            <div className="home-page-box-container">

                <BoxWrapper flex={2}>
                    <div className="home-page-box">
                        <FileExplorer />
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
                        <RepositoryInsights />
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={2}>
                    <div className="home-page-box">
                        <OnBoardingGuide />
                    </div>
                </BoxWrapper>

                <BoxWrapper flex={1}>
                    <div className="home-page-box">
                        <RecentQuestions />
                    </div>
                </BoxWrapper>

            </div>
        </div>
    )
}

