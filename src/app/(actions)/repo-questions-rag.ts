
'use server';

import { ConnectMCP } from "../mcp/connect-mcp"

export default async function repoQuestionsRAG(_prevState: any, formData: FormData) {

    const userRepoQuery = formData.get("user-repo-query") as string;
    try {

        const client = await ConnectMCP()

        const analyzeGithubAskRepoQuestions = await client.callTool({
            name: "call-github-ask-repo-questions",
            arguments: {
                userRepoQuery
            }
        }, undefined, { timeout: 120000 })


        return {
            state: "Success",
            message: "Github Repo Analyzed",
            data: JSON.stringify(analyzeGithubAskRepoQuestions),
            question: userRepoQuery
        }

    } catch (error) {
        console.error("Analysis Error:", error);
        return {
            state: "Failed",
            message: "Github Repo Analysis Failed",
            data: null
        }
    }
}

