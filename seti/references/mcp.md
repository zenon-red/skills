# MCP Reference

## Configuration

```json
{
  "mcpServers": {
    "seti": {
      "command": "seti"
    }
  }
}
```

## `web_search`

Search the web and return TOON-formatted results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query (1–500 chars) |
| `num_results` | number | No | Results to return (1–100, default 20) |

Example:

```json
{ "query": "TypeScript best practices", "num_results": 20 }
```

Output:

```
results[3]{title,url,description}:
  Understanding TypeScript,https://example.com/ts,A comprehensive guide...
  TypeScript Handbook,https://example.com/handbook,Official documentation...
```

## `enrich_content`

Fetch full page content for URLs via Jina Reader.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `urls` | string[] | Yes | URLs to enrich (1–10) |
| `max_chars` | number | No | Max chars per result (500–10000, default 5000) |

Example:

```json
{
  "urls": ["https://example.com/article"],
  "max_chars": 5000
}
```

## Provider Routing Strategies

| Strategy | Description |
|----------|-------------|
| `priority` | Use providers by configured priority (default) |
| `fastest` | Route to provider with best response time |
| `round_robin` | Distribute requests evenly |
| `weighted_random` | Weighted random selection |

## Supported Providers

SearXNG (primary), Tavily, Exa AI, Brave Search, Google Custom Search, Firecrawl, SerpAPI, Jina Reader, DuckDuckGo.
