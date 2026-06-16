export async function openrouter(messages: { role: string, content: any }[]) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: messages
        })
    })

    const data = await response.json();

    console.log(data);
    return data;
}