# 🔍 GitAnalyzer — GitHub Repository Analyzer Dashboard

> An AI-powered dashboard that analyzes any public GitHub repository and lets you explore, ask questions, and semantically search through the codebase using RAG (Retrieval-Augmented Generation).

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://github-repository-analyzer-dashboar-azure.vercel.app)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter%20%2F%20GPT--4o--mini-orange)](https://openrouter.ai)
[![pgvector](https://img.shields.io/badge/Vector%20DB-PostgreSQL%20%2B%20pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)

---

## 🌐 Live Demo

**[github-repository-analyzer-dashboar-azure.vercel.app](https://github-repository-analyzer-dashboar-azure.vercel.app)**

---

## ✨ What It Does

Paste any public GitHub repository URL and GitAnalyzer will:

1. **Analyze the repository** — fetches README, file tree, package.json, stats, and language breakdown in parallel
2. **Generate an AI overview** — uses GPT-4o-mini to summarize the README and file structure
3. **Store everything in PostgreSQL** — persists analysis results for fast reload
4. **Build a searchable vector index** — chunks and embeds README + file tree + package analysis using `text-embedding-3-small`
5. **Let you ask natural-language questions** — RAG-powered Q&A over the actual codebase content
6. **Semantic search** — hybrid vector + full-text search to find relevant code sections by concept

---

## 🧩 Features

| Feature | Description |
|---------|-------------|
| 🔎 **Repo Analysis** | Fetches and AI-analyzes README, file tree, package.json, languages and GitHub stats |
| 🤖 **Ask Repository** | Chat-style Q&A — ask anything about the codebase, answered using RAG context |
| 🧠 **Semantic Search** | Search by concept (e.g. "authentication flow", "database setup") using vector embeddings |
| 📁 **File Explorer** | Browse the repository tree structure visually |
| 📊 **Repository Insights** | Stars, forks, watchers, license, open issues with a donut chart language breakdown |
| 📦 **Package Analysis** | Dependency table with npm links for all detected packages |
| 🗂️ **Recent Analysis** | Load previously analyzed repositories instantly from the database |
| 💾 **Persistent Storage** | All analyses saved to PostgreSQL — no re-analysis needed on revisit |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Server      │    │  MCP Server  │    │  RAG Engine  │  │
│  │  Actions     │───▶│  (In-Memory) │───▶│              │  │
│  │  (use server)│    │              │    │  Embeddings  │  │
│  └──────────────┘    └──────────────┘    │  + pgvector  │  │
│         │                   │            └──────────────┘  │
│         ▼                   ▼                   │           │
│  ┌──────────────┐    ┌──────────────┐           │           │
│  │  GitHub API  │    │  OpenRouter  │           │           │
│  │  (REST)      │    │  GPT-4o-mini │           ▼           │
│  └──────────────┘    └──────────────┘    ┌──────────────┐  │
│                                          │  PostgreSQL  │  │
│                                          │  + pgvector  │  │
│                                          └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **MCP (Model Context Protocol)** — All AI tool calls are wrapped in an MCP server, making them composable and replaceable
- **Fresh MCP instance per request** — Avoids "server already started" errors on Vercel serverless (each request creates a new `McpServer`)
- **Hybrid Search** — Combines pgvector cosine similarity with PostgreSQL full-text search (`tsvector`) for better RAG recall
- **Repo-scoped search** — All vector searches are scoped to the latest analyzed repo URL to avoid mixing results across repos

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, Server Actions) |
| **Language** | TypeScript 6 |
| **LLM** | [OpenRouter](https://openrouter.ai) → `openai/gpt-4o-mini` |
| **Embeddings** | OpenRouter → `openai/text-embedding-3-small` (1536 dims) |
| **Vector DB** | PostgreSQL + [pgvector](https://github.com/pgvector/pgvector) |
| **Text Splitting** | `@langchain/textsplitters` (MarkdownTextSplitter) |
| **AI Protocol** | [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk) |
| **Styling** | Vanilla CSS (dark theme, glassmorphism) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with `pgvector` extension enabled
- [OpenRouter](https://openrouter.ai) API key (for LLM + embeddings)

### 1. Clone the repository

```bash
git clone https://github.com/Pursharthzutshi/github-repository-analyzer-dashboard.git
cd github-repository-analyzer-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# OpenRouter (LLM + Embeddings)
OPENROUTER_API_KEY=your_openrouter_api_key

# PostgreSQL connection
# Option A: Connection string (recommended for Vercel/Neon/Supabase)
POSTGRES_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Option B: Individual fields
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=github_analyzer
```

### 4. Set up the database

The app auto-creates tables on first run. You only need to ensure the `pgvector` extension is available:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (actions)/                           # Next.js Server Actions
│   │   ├── github-analysis.ts               # Main repo analysis orchestrator
│   │   ├── repo-questions-rag.ts            # Ask Q&A server action
│   │   ├── repo-semantic-find-questions.rag.ts  # Semantic search action
│   │   ├── store-repo-data.ts               # DB persistence actions
│   │   └── get-analysis.ts                  # Fetch stored analysis
│   ├── mcp/
│   │   ├── index.ts                         # MCP tool definitions (registerMcpTools)
│   │   ├── connect-mcp.ts                   # MCP client factory (fresh instance per request)
│   │   ├── ai-prompt.ts                     # Shared LLM prompt builder
│   │   └── call-github-repo.ts              # GitHub API fetcher
│   ├── lib/
│   │   ├── models/analysis.ts               # PostgreSQL schema + queries
│   │   ├── openrouter/                      # LLM + embeddings client
│   │   └── rag/
│   │       ├── vector-store.ts              # Chunks + embeds repo content
│   │       ├── embeddings.ts                # Batch embedding helper
│   │       └── retrievalRag/
│   │           ├── askRagRepoQuestionRetriever.ts  # RAG retrieval pipeline
│   │           ├── hybridSearchQueries.ts          # pgvector + full-text SQL
│   │           └── combineHybridSearch.ts          # Dedup + merge results
│   └── askRepoQuestions/
│       └── page.tsx                         # Ask Repository chat page
├── components/
│   ├── AnalyzeSearchInput.tsx               # URL input form
│   └── HomePage/
│       ├── SemanticSearch.tsx               # Semantic search panel
│       ├── FileExplorer.tsx                 # Repository tree viewer
│       ├── GithubRepoOverview.tsx           # Header overview card
│       ├── RepositoryInsights.tsx           # Stats + donut chart
│       ├── RepositoryGeneralOverview.tsx    # Package dependency table
│       ├── TechStack.tsx                    # Tech stack detection
│       └── RecentAnalysis.tsx              # Previously analyzed repos
```

---

## 🔄 How the RAG Pipeline Works

```
User Query
    │
    ▼
openrouterEmbeddings(query)  →  1536-dim vector
    │
    ├── Vector Search (pgvector cosine similarity, LIMIT 3)
    │       Scoped to latest repo_url
    │
    └── Full-text Search (PostgreSQL tsvector, LIMIT 3)
            Scoped to latest repo_url
                │
                ▼
        combineHybridSearch()  →  Dedup by chunk ID
                │
                ▼
        Top chunks joined as context (max 3,000 chars)
                │
                ▼
        GPT-4o-mini answers the question
        (max_tokens: 1024, temperature: 0.3)
```

### What Gets Embedded

When you analyze a repo, three sources are chunked and embedded into pgvector:

| Source | Why |
|--------|-----|
| `README.md` (AI summary) | Project overview, setup instructions |
| **File Tree** (AI analysis) | Folder structure, file names, directory purposes |
| **package.json** (AI analysis) | Dependencies, scripts, framework detection |

---

## ⚙️ Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key for LLM + embeddings |
| `POSTGRES_URL` | ✅* | Full PostgreSQL connection string |
| `DB_HOST` | ✅* | Database host (if not using `POSTGRES_URL`) |
| `DB_PORT` | | Database port (default: 5432) |
| `DB_USER` | ✅* | Database user |
| `DB_PASSWORD` | ✅* | Database password |
| `DB_NAME` | ✅* | Database name |

*Either `POSTGRES_URL` or the individual `DB_*` variables are required.

---

## 🚢 Deployment

This project is deployed on **Vercel** with a **Neon** (or any PostgreSQL provider with pgvector) database.

### Vercel Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

> **Note:** The MCP server uses `InMemoryTransport` — it runs fully in-process within Next.js server actions, so no separate server process is needed.

---

## 📝 License

MIT © [Pursharth Zutshi](https://github.com/Pursharthzutshi)

---

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai) for unified LLM API access
- [pgvector](https://github.com/pgvector/pgvector) for vector similarity search in PostgreSQL
- [Model Context Protocol](https://modelcontextprotocol.io) for the AI tool orchestration layer
- [LangChain Text Splitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/) for markdown-aware chunking
