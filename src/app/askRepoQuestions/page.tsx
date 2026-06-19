import { useActionState, useEffect, useState } from "react"
import { Send, Bot, Loader2 } from "lucide-react"
import repoQuestionsRAG from "../(actions)/repo-questions-rag"
import "./AskRepoQuestions.css"

export default function AskRepoQuestions() {

    const initialState: any = {
        state: "",
        message: "",
        data: null
    }

    const [state, formAction, isPending] = useActionState(repoQuestionsRAG, initialState)
    const [parsedResponse, setParsedResponse] = useState<string>("");

    useEffect(() => {
        if (state?.data) {
            try {
                // Parse the outer MCP JSON wrapper
                const outer = JSON.parse(state.data);
                if (outer?.content?.[0]?.text) {
                    // Try to parse the inner text response
                    try {
                        const inner = JSON.parse(outer.content[0].text);
                        let text = inner?.message;
                        
                        // If it's a nested openrouter object, extract the content
                        if (typeof text === 'object' && text?.choices) {
                            text = text.choices[0]?.message?.content;
                        }
                        setParsedResponse(text || "No response generated");
                    } catch {
                        // If it's not JSON, just display the raw text
                        setParsedResponse(outer.content[0].text);
                    }
                }
            } catch (e) {
                setParsedResponse("Failed to parse the AI response.");
                console.error(e);
            }
        }
    }, [state])

    return (
        <div className="ask-repo-questions-container">
            <div className="ask-repo-header">
                <h3>Ask Repository</h3>
                <span className="ask-repo-badge">AI Powered</span>
            </div>

            <div className="ask-repo-chat-area">
                {parsedResponse ? (
                    <div className="ask-repo-message assistant-message">
                        <Bot size={18} className="message-icon" />
                        <div className="message-content">{parsedResponse}</div>
                    </div>
                ) : (
                    <div className="ask-repo-empty-state">
                        <Bot size={32} className="empty-icon" />
                        <p>Ask a question to search the codebase.</p>
                    </div>
                )}
            </div>

            <form action={formAction} className="ask-repo-form">
                <input 
                    type="text" 
                    name="user-repo-query" 
                    placeholder="E.g., How does the authentication work?"
                    className="ask-repo-input"
                    required
                    disabled={isPending}
                />
                <button type="submit" className="ask-repo-submit" disabled={isPending}>
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    )
}
