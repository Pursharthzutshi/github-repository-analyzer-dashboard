# GitHub Repo Analyzer Dashboard

> An AI-powered dashboard that deeply analyzes any public GitHub repository — surfacing architecture insights, tech stack breakdowns, repository stats, and letting you ask natural-language questions about the codebase using a Retrieval-Augmented Generation (RAG) pipeline.

---

## What This Project Does

Paste any public GitHub repository URL and the dashboard instantly:

1. **Fetches & analyzes the repo** — README, file tree, `package.json`, contributor stats, and language breakdown — all in parallel via an MCP (Model Context Protocol) server.
2. **Generates AI insights** — A Senior Engineer-level AI summary of architecture, dependencies, and file structure using an OpenRouter-backed LLM.
3. **Embeds repo content into a vector database** — The README, file tree, and package.json analysis are chunked with LangChain's `MarkdownTextSplitter` and embedded using Google Generative AI, then stored in PostgreSQL with the `pgvector` extension.
4. **Lets you ask questions about the codebase** — A RAG pipeline does a hybrid search (vector similarity + full-text) over the stored chunks and feeds the most relevant context to the LLM to answer your questions accurately.
5. **Semantic search** — Directly search repository content using natural-language similarity queries, returning the raw matching chunks.

---

## Key Features

| Feature | Description |
|---|---|
| 🔍 **Repo Overview** | AI-generated summary of what the repo does, who owns it, and its purpose |
| 🗂 **File Explorer** | Interactive tree view of the repository's full file structure |
| 📦 **Tech Stack** | Language breakdown with byte counts and percentages |
| 📊 **Repository Insights** | Stars, forks, watchers, open issues, license, visibility, and timestamps |
| 🤖 **Ask AI Questions** | RAG-powered Q&A — ask anything about the codebase in plain English |
| 🔎 **Semantic Search** | Embedding-based similarity search over the repo content chunks |
| 💾 **Persistent Storage** | Analysis results and embeddings are persisted in PostgreSQL for instant re-loading |
| 🔄 **History** | Browse previously analyzed repositories from the sidebar |

---

## Architecture

```
User enters GitHub URL
        │
        ▼
┌───────────────────┐
│   Next.js App     │  (React 19, Server Actions, useActionState)
│   /src/app        │
└────────┬──────────┘
         │ Server Action: githubRepoAnalysis()
         ▼
┌───────────────────────────────────────────────┐
│              MCP Server (in-process)          │
│  ┌──────────────────────────────────────────┐ │
│  │  analyze-github-repo-readme              │ │
│  │  analyze-github-repo-tree                │ │  ← Parallel via Promise.allSettled()
│  │  analyze-github-repo-package-json        │ │
│  │  analyze-github-repo-insights            │ │
│  │  analyze-github-repo-languages           │ │
│  └──────────────────────────────────────────┘ │
│           │ GitHub REST API + OpenRouter LLM  │
└───────────┼───────────────────────────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
PostgreSQL     pgvector table
(raw data)     (chunked embeddings)
     │             │
     └──────┬──────┘
            │
            ▼
┌───────────────────────────────┐
│   RAG Retrieval Pipeline      │
│  Hybrid Search:               │
│  • Vector similarity (ANN)    │
│  • Full-text (tsvector)       │
│  • Filtered by latest repo    │
└───────────────────────────────┘
            │
            ▼
      OpenRouter LLM
   (final AI answer)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| **Language** | TypeScript |
| **UI** | React 19, Vanilla CSS |
| **Icons** | Lucide React |
| **Markdown rendering** | `react-markdown` |
| **AI / LLM** | [OpenRouter](https://openrouter.ai/) (configurable model) |
| **Embeddings** | Google Generative AI (`@google/generative-ai`) |
| **Vector store** | PostgreSQL + [`pgvector`](https://github.com/pgvector/pgvector) |
| **Database client** | `pg` (node-postgres) |
| **Text chunking** | LangChain `MarkdownTextSplitter` (`@langchain/textsplitters`) |
| **Tool protocol** | Model Context Protocol SDK (`@modelcontextprotocol/sdk`) |
| **External API** | GitHub REST API (public, unauthenticated) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Project Structure

```
src/
├── app/
│   ├── (actions)/               # Next.js Server Actions
│   │   ├── github-analysis.ts   # Main analysis action — calls all MCP tools in parallel
│   │   ├── repo-questions-rag.ts# RAG Q&A action — calls MCP ask-questions tool
│   │   ├── repo-semantic-find-questions.rag.ts  # Semantic search action
│   │   ├── store-repo-data.ts   # Persists analysis + embeddings to PostgreSQL
│   │   └── get-analysis.ts      # Fetches latest analysis from DB on page load
│   ├── lib/
│   │   ├── models/
│   │   │   └── analysis.ts      # PostgreSQL pool + all DB table schemas & queries
│   │   ├── rag/
│   │   │   ├── vector-store.ts  # Chunks content & stores embeddings (Google AI)
│   │   │   ├── embeddings.ts    # Google Generative AI embedding wrapper
│   │   │   └── retrievalRag/
│   │   │       ├── hybridSearchQueries.ts       # pgvector ANN + tsvector full-text search
│   │   │       └── askRagRepoQuestionRetriever.ts  # Merges results, deduplicates, ranks
│   │   ├── openrouter/          # OpenRouter LLM API client
│   │   └── storage.ts           # localStorage utility for client-side caching
│   ├── mcp/
│   │   ├── index.ts             # All MCP tool registrations (analyze, ask, search)
│   │   ├── connect-mcp.ts       # Creates a fresh McpServer per request (serverless-safe)
│   │   ├── call-github-repo.ts  # GitHub REST API wrapper (owner/repo parsing, metadata)
│   │   └── ai-prompt.ts         # Shared AI prompt builder for OpenRouter calls
│   ├── analytics/               # Analytics page (repo history)
│   ├── askRepoQuestions/        # Ask AI page route
│   ├── repositories/            # Repositories browser page
│   └── page.tsx                 # Home dashboard — orchestrates all widgets
├── components/
│   ├── HomePage/
│   │   ├── GithubRepoOverview.tsx       # AI-generated repo summary panel
│   │   ├── FileExplorer.tsx             # Interactive file tree viewer
│   │   ├── RepositoryInsights.tsx       # Stars, forks, issues, license stats
│   │   ├── RepositoryGeneralOverview.tsx# General overview card
│   │   ├── TechStack.tsx                # Language breakdown with percentages
│   │   └── SemanticSearch.tsx           # Semantic search widget
│   ├── AnalyzeSearchInput.tsx   # URL input form + submit
│   ├── Navbar.tsx               # Top navigation bar
│   └── Leftsidebar.tsx          # Sidebar with repo history
└── index.css / App.css          # Global styles
```

---

## Database Schema

### `github_repo_analysis_data`
Stores the raw analysis results for each repository.

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `repo_url` | TEXT | Full GitHub repository URL |
| `readme` | TEXT | AI-analysed README content |
| `tree` | TEXT | AI-analysed file tree |
| `packageJson` | TEXT | AI-analysed package.json |
| `insights` | TEXT | Raw stats JSON (stars, forks, etc.) |
| `languages` | TEXT | Language breakdown JSON |
| `analyzed_at` | TIMESTAMPTZ | Timestamp of analysis |

### `github_repo_analysis_chunk_vector_data`
Stores chunked, embedded content for RAG retrieval.

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL | Primary key |
| `repo_url` | TEXT | Source repository URL |
| `chunk` | TEXT | Text chunk content |
| `embedding` | vector(1536) | Google AI embedding |
| `metadata` | JSONB | Source section label + repo_url |

---

## RAG Pipeline (How AI Q&A Works)

1. **Ingestion** — When a repo is analyzed, the README, file tree, and package.json analysis are split into 1000-character chunks (with 100-character overlap) using LangChain's `MarkdownTextSplitter`.
2. **Embedding** — Each chunk is embedded into a 1536-dimensional vector using Google Generative AI and stored in the `pgvector` table. Old chunks for the same repo are deleted first to prevent stale data.
3. **Retrieval (Hybrid Search)** — On a user question, two queries run in parallel:
   - **Vector search**: Approximate nearest-neighbor (`<=>` cosine distance) on the `embedding` column, filtered to the latest analyzed repo.
   - **Full-text search**: PostgreSQL `tsvector` / `plainto_tsquery` match on the `chunk` column.
4. **Ranking** — Results from both searches are merged, deduplicated by content, and ranked by similarity score.
5. **Generation** — The top-ranked chunks are passed as context to the OpenRouter LLM, which generates a final answer grounded in the actual repository content.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database with the [`pgvector`](https://github.com/pgvector/pgvector) extension enabled
- API keys for OpenRouter and Google Generative AI

### 1. Clone and install

```bash
git clone https://github.com/your-username/github-repo-analyzer-dashboard.git
cd github-repo-analyzer-dashboard
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection (use one of the two options below)
POSTGRES_URL=postgresql://user:password@host:5432/dbname

# — OR — individual fields:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=repo_analyzer

# AI providers
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# Optional: GitHub token to avoid rate limiting on the GitHub API
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Enable pgvector

Run this once in your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

> The application will automatically create the required tables on the first analysis run.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Enter a GitHub URL** in the search bar at the top (e.g. `https://github.com/facebook/react`).
2. **Wait for analysis** — the dashboard fetches README, file tree, package.json, stats, and languages in parallel and generates AI summaries. This typically takes 10–30 seconds.
3. **Explore the dashboard** — review the overview, file explorer, tech stack, and repository insights panels.
4. **Ask questions** — use the "Ask AI" panel to ask anything about the codebase in plain English.
5. **Semantic search** — use the search panel to find specific content by meaning, not just keywords.
6. **Browse history** — previously analyzed repositories are stored in the database and accessible from the sidebar.

---

## Deployment

This project is configured for [Vercel](https://vercel.com/) deployment (`vercel.json` is included).

```bash
npm run build
```

Set all environment variables from the `.env` section above in your Vercel project settings. Make sure your PostgreSQL database is accessible from Vercel's serverless functions (e.g., via [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

---

## License

MIT
