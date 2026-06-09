import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod"
import { openrouter } from "../lib/openrouter/openrouter";


export const server = new McpServer({
    name: "github-repo-analyzer-dashboard",
    version: "1.0.0",
})


server.resource("all-analysis","analysis://all",async (uri)=>{

    return{
        contents:[
            {
                uri:uri.href,
                mimeType:"application/json",
                text:JSON.stringify("text")
            }
            
        ]
    }
})

server.tool("analyze-github-repo","analyze the github repo and return insights",{
  githubRepoUrl:z.string()  
},async({githubRepoUrl})=>{

    const fetchRepoData = await fetch(githubRepoUrl)
    const repoData = await fetchRepoData.json()

    const aiResponse = await openrouter([{role:"user",content:repoData}])


    console.log(aiResponse);
    return {
        content:[      
          {
            type:"text",text:JSON.stringify(repoData)
          }
        ]
}


})