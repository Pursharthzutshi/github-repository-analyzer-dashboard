export async function openrouter(messages: { role: string, content: any }[]) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: messages,
            response_format: { type: "json_object" }
        })
    })

    const data = await response.json();

    console.log(data);
    return data;
}