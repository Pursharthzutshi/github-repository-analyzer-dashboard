//Dummy file


// Fetch README
try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { "Accept": "application/vnd.github.raw" }
    });
    if (readmeRes.ok) {
        readme = await readmeRes.text();
    }
} catch (e) { console.error("Error fetching readme", e); }

// Fetch File Tree
try {
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
    if (treeRes.ok) {
        const treeData = await treeRes.json();
        if (treeData.tree) {
            fileTree = treeData.tree.map((item: any) => item.path).join("\n");
        }
    }
} catch (e) { console.error("Error fetching tree", e); }

// Fetch package.json
try {
    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
        headers: { "Accept": "application/vnd.github.raw" }
    });
    if (pkgRes.ok) {
        packageJson = await pkgRes.text();
    }
} catch (e) { console.error("Error fetching package.json", e); }



// const systemPrompt = "You are a Senior Software Engineer. Analyze the repository in deep technical detail. Return ONLY a valid JSON object with the exact keys: summary (a detailed 3-paragraph string explaining the main purpose and features), architecture (a detailed multi-paragraph string explaining the file structure, patterns, and system design), techStack (array of strings), and onboardingSteps (array of strings). Do NOT be brief. Write extensive, detailed analysis for the summary and architecture fields.";
// ${JSON.stringify({ name: repoData.name, description: repoData.description }, null, 2)}

//     const combinedData = `
// Repository Metadata:
// ${JSON.stringify({ name: repoData.name, description: repoData.description, stars: repoData.stargazers_count, default_branch: repoData.default_branch }, null, 2)}
// `;


// { "summary": "The 'blog-studio' repository is a Next.js-based application designed to facilitate the creation, management, and analysis of blog content. It provides a robust interface for users to establish new blog posts, analyze existing content, and manage various account functionalities such as authentication and user management. Primarily developed to leverage the full capabilities of Next.js, this project enables dynamic and server-side rendering of pages. This ensures that the application is SEO-friendly and delivers excellent performance and user experience by pre-rendering pages and optimizing load times. Additionally, the application integrates generative AI features through dependencies like `@google/generative-ai` and `openai`, providing advanced capabilities, such as generating blog content and enhancing engagement with automated responses to user inquiries.", "architecture": "The architecture of the 'blog-studio' application follows the modular structure provided by Next.js, where the project is organized around a single `app` directory that contains all functional components of the application, divided into pages and reusable components. The pages contain routing information, clearly demonstrated through folders named according to the desired URL structure. For instance, the `app/blog/[id]` path structure indicates a dynamic routing approach where each blog post can be individually accessed via its unique identifier, enhancing the scalability of the application. Under the `actions` directory, various TypeScript files implement specific functionalities, such as creating, analyzing, and managing blog content. This encapsulation of logic allows for clear separation of concerns and maintainability, adhering to best practices in software development. The usage of technology such as TypeScript not only improves the type safety of the application but also aids in comprehensibility for developers who may interact with the codebase over time.", "techStack": [ "Next.js", "React", "TypeScript", "Mongoose", "OpenAI API", "Langchain", "JWT (jsonwebtoken)", "TailwindCSS" ], "onboardingSteps": [ "Clone the repository using git clone.", "Navigate into the project directory using cd blog-studio.", "Install the necessary dependencies by running npm install.", "Run the development server with npm run dev.", "Open your web browser and visit http://localhost:3000 to view the application.", "Familiarize yourself with the file structure, focusing on the app folder, where most of the application logic resides.", "Explore the components within the app directory, particularly in actions and pages, to understand the available functionalities.", "Read through the provided README.md and AGENTS.md files for additional context and operational details." ] }


// const combinedData = `
    
//     Repository Metadata:
//     ${JSON.stringify({ name: repoData.name, description: repoData.description, stars: repoData.stargazers_count, default_branch: repoData.default_branch }, null, 2)}
//     ---
//     File Tree:
//     ${fileTree}
    
//     ---
//     Dependencies (package.json):
//     ${packageJson}
    
//     ---
//     README:
//     ${readme}
    
//     `;
