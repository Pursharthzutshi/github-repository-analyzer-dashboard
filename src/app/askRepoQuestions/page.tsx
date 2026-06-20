"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { Send, Bot, Loader2, User } from "lucide-react"
import repoQuestionsRAG from "../(actions)/repo-questions-rag"
import "./AskRepoQuestions.css"

export default function AskRepoQuestions() {

    const initialState: any = {
        state: "",
        message: "",
        data: null,
        question: ""
    }

    const [state, formAction, isPending] = useActionState(repoQuestionsRAG, initialState)
    const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("repo_chat_history");
        if (stored) {
            try {
                setChatHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load chat history", e);
            }
        }
    }, [])

    // Scroll to bottom when history changes or pending
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isPending]);

    useEffect(() => {
        if (state?.state === "Success" && state?.data && state?.question) {
            try {
                let parsedResponse = "";
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
                        parsedResponse = text || "No response generated";
                    } catch {
                        // If it's not JSON, just display the raw text
                        parsedResponse = outer.content[0].text;
                    }
                }
                
                // Add to history and save to local storage
                if (parsedResponse) {
                    const newEntry = { question: state.question, answer: parsedResponse };
                    setChatHistory(prev => {
                        // Prevent duplicate updates from React Strict Mode double-invocations
                        if (prev.length > 0 && prev[prev.length - 1].question === newEntry.question && prev[prev.length - 1].answer === newEntry.answer) {
                            return prev;
                        }
                        const newHistory = [...prev, newEntry];
                        localStorage.setItem("repo_chat_history", JSON.stringify(newHistory));
                        return newHistory;
                    });
                }
            } catch (e) {
                console.error("Failed to parse the AI response.", e);
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
                {chatHistory.length > 0 ? (
                    <div className="ask-repo-chat-list">
                        {chatHistory.map((chat, idx) => (
                            <div key={idx} className="ask-repo-chat-pair">
                                <div className="ask-repo-message user-message">
                                    <div className="message-content">{chat.question}</div>
                                    <User size={18} className="message-icon user-icon" />
                                </div>
                                <div className="ask-repo-message assistant-message">
                                    <Bot size={18} className="message-icon bot-icon" />
                                    <div className="message-content">{chat.answer}</div>
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="ask-repo-message assistant-message pending-message">
                                <Loader2 size={18} className="message-icon bot-icon animate-spin" />
                                <div className="message-content typing-indicator">Thinking...</div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                ) : (
                    <div className="ask-repo-empty-state">
                        {isPending ? (
                            <>
                                <Loader2 size={32} className="empty-icon animate-spin" />
                                <p>Searching the repository...</p>
                            </>
                        ) : (
                            <>
                                <Bot size={32} className="empty-icon" />
                                <p>Ask a question to search the codebase.</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <form action={(formData) => {
                const form = document.querySelector('.ask-repo-form') as HTMLFormElement;
                formAction(formData);
                if (form) form.reset(); // clear input after submitting
            }} className="ask-repo-form">
                <input 
                    type="text" 
                    name="user-repo-query" 
                    placeholder="E.g., How does the authentication work?"
                    className="ask-repo-input"
                    required
                    disabled={isPending}
                    autoComplete="off"
                />
                <button type="submit" className="ask-repo-submit" disabled={isPending}>
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    )
}
