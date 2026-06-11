import { ConnectMCP } from "../mcp/connect-mcp"

export default async function githubRepoAnalysis(prevState: any, formData: FormData){

    const githubRepoUrl = formData.get("github-repo-url")
    try{
        
       const client = await ConnectMCP()

      const result = await client.callTool({
        name:"analyze-github-repo",
        arguments: {
            githubRepoUrl
        }
       }, undefined, { timeout: 120000 }) // Pass undefined for resultSchema to use the default, and options as 3rd arg

       return {
        state:"Success",
        message:"Github Repo Analyzed",
        data:JSON.stringify(result)
       };
    }catch(error){

       return {
        state:"Failed",
        message:"Github Repo Analysis Failed",
        data:null
       }
    }
}