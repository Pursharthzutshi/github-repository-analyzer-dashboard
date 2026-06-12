import { openrouter } from "./src/app/lib/openrouter/openrouter";
openrouter([
    { role: "system", content: "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return ONLY a valid Markdown: Name, README, Owner. Here Readme should be the analysis about the repo" },
    { role: "user", content: "hello" }
]).then(res => console.log(JSON.stringify(res, null, 2)));
