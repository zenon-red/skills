---
name: seti
description: Web search and content enrichment via SETI MCP server. Use for querying the web, fetching page content, and research — powered by SearXNG with API fallbacks, returning TOON-formatted results.
---

# SETI

## Default Workflow

1. **Search**: call `web_search` with a query
2. **Filter**: scan TOON results for relevant URLs
3. **Enrich**: call `enrich_content` on 1–10 URLs for full page text
4. **Synthesize**: use enriched content to answer or act

All output is TOON-formatted for minimal token usage.

## MCP Tools

### `web_search`

Search the web and return TOON-formatted results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query (1–500 chars) |
| `num_results` | number | No | Results to return (1–100, default 20) |

```json
{ "query": "TypeScript best practices", "num_results": 20 }
```

Use wider sweeps (50+) for ambiguous or broad topics.

### `enrich_content`

Fetch full page content for URLs via Jina Reader.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `urls` | string[] | Yes | URLs to enrich (1–10) |
| `max_chars` | number | No | Max chars per result (500–10000, default 5000) |

```json
{ "urls": ["https://example.com/article"], "max_chars": 5000 }
```

Always enrich before citing specifics from a URL.

## CLI Mode

```bash
seti "TypeScript best practices"
seti "rust vs go" 10
seti setup
seti verify
```

CLI output is also TOON-formatted.

## Setup

```bash
seti setup                    # interactive
seti setup --non-interactive  # for agents
seti verify                   # check SearXNG health
```

SearXNG runs locally (Docker or `uv`). API keys are optional fallbacks.

## Configuration

| Variable | Description |
|----------|-------------|
| `SETI_SEARXNG_BASE_URL` | SearXNG instance URL |
| `SETI_PROVIDER_ROUTING_STRATEGY` | `priority` (default), `fastest`, `round_robin`, `weighted_random` |
| `SETI_DEFAULT_RESULTS` | Default result count (default 20) |
| `SETI_CACHE_ENABLED` | Enable result caching (default true) |
| `SETI_LOG_LEVEL` | `debug`, `info`, `warn`, `error` |

Optional API keys: `TAVILY_API_KEY`, `EXA_API_KEY`, `BRAVE_API_KEY`, `GOOGLE_API_KEY`, `GOOGLE_CX`, `FIRECRAWL_API_KEY`, `SERPAPI_API_KEY`, `JINA_API_KEY`.

## Execution Rules

- Prefer `web_search` over browser automation for factual queries
- Use `enrich_content` when you need details beyond title + snippet
- Batch up to 10 URLs per `enrich_content` call
- Results are TOON by default — no parsing needed
- If search fails, check `seti verify` for backend health

## Provider Fallback

SETI routes through SearXNG first, then falls back to configured API providers. Circuit breaker prevents hammering failing providers. Quota tracking persists at `~/.config/seti/usage.json`.

## Tech Stack

- Language: TypeScript
- Runtime: Bun
- Protocol: Model Context Protocol (MCP)
- Validation: Zod
- Lint/format: oxlint + oxfmt

## Development Commands

```bash
bun install
bun run lint
bun run typecheck
bun run build
bun test
bun run smoke:mcp
```

## Architecture

```text
src/
├── mcp/          # MCP server and tool handlers
├── balancer/     # provider strategy, fallback, breaker, quota tracker
├── providers/    # provider-specific adapters
├── cache/        # in-memory cache
├── config/       # defaults + layered config loading
├── setup/        # setup and verify CLIs
└── utils/        # logging, validation, normalization helpers
```

## Agent Guidelines

- Keep output format stable for MCP tools (`web_search`, `enrich_content`).
- Preserve fallback and quota semantics unless explicitly requested to change them.
- Validate provider-specific API parameter changes against upstream docs before implementation.
- Keep setup flows idempotent and non-destructive.
- Run lint, typecheck, build, and tests before finalizing changes.
