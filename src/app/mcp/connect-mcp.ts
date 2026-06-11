import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory";
import {server as myLocalServer} from "../mcp/index"
import { Client } from "@modelcontextprotocol/sdk/client"

let cachedClient: Client | null = null;

export async function ConnectMCP(){
    if (cachedClient) {
        return cachedClient;
    }

    try {
        const [clientTransport,serverTransport] = InMemoryTransport.createLinkedPair()
          
        await myLocalServer.connect(serverTransport);

        const client = new Client(
            {name:"github-repo-analyzer-client",version:"1.0.0"},
            {capabilities:{}}
        )
        
        await client.connect(clientTransport)

        cachedClient = client;
        return client
    } catch(error){
        console.error("[MCP] connectMcp failed:", error)
        throw error
    }
}