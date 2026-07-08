import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory";
import { Client } from "@modelcontextprotocol/sdk/client"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

// Import tool registration functions — NOT the singleton server instance
import { registerMcpTools } from "../mcp/index"

export async function ConnectMCP() {
    try {
        // Create a fresh server instance per request.
        // Reusing a singleton causes "Server already started" errors on the second
        // call (and always on Vercel serverless where modules can be reused across requests).
        const freshServer = new McpServer({
            name: "github-repo-analyzer-dashboard",
            version: "1.0.0",
        });

        registerMcpTools(freshServer);

        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()

        await freshServer.connect(serverTransport);

        const client = new Client(
            { name: "github-repo-analyzer-client", version: "1.0.0" },
            { capabilities: {} }
        )

        await client.connect(clientTransport)

        return client
    } catch (error) {
        console.error("[MCP] connectMcp failed:", error)
        throw error
    }
}