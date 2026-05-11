# CLI Reference

## Commands

| Command | Description |
|---------|-------------|
| `seti` | Start MCP server mode (default) |
| `seti <query> [num]` | Search from CLI |
| `seti setup` | Configure SearXNG and providers |
| `seti verify` | Check SearXNG health |
| `seti --version` | Show version |
| `seti --help` | Show help |

## Search

```bash
seti "TypeScript best practices"
seti "rust vs go" 10
```

## Setup Flags

| Flag | Description |
|------|-------------|
| `-n, --non-interactive` | No prompts (agents) |
| `-d, --docker` | Force Docker mode |
| `-u, --uv` | Force uv mode |

## Verify Flags

| Flag | Description |
|------|-------------|
| `-s, --silent` | Machine-parseable output |
| `-u, --url <url>` | Check specific URL |

### Verify Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | Health check failed |
| 2 | Search probe failed |
| 3 | Invalid arguments |
