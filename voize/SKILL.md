---
name: voize
description: Generate TTS audio, upload to object storage, and return public audio URLs through MCP.
---

# Voize

## Overview

`Voize` is a local MCP server that provides one tool, `generate_tts_url`.

It synthesizes speech using the current backend, uploads bytes to the current storage backend, and returns a public URL.

Current concrete support is Xiaomi MiMo (TTS) + Cloudflare R2 (storage), while keeping extension seams for future backends.

## Tech Stack

- Language: TypeScript
- Runtime: Bun 1.0+
- Key dependencies: `@modelcontextprotocol/sdk`, `@aws-sdk/client-s3`, `zod`

## Architecture

The server is stdio MCP with one tool handler.

```
src/
├── index.ts
├── lib/
│   ├── provider.ts
│   └── storage.ts
├── tools/
│   └── generateTtsUrl.ts
├── types.ts
└── utils/
    ├── env.ts
    ├── log.ts
    ├── retry.ts
    └── validate.ts
```

## Development

### Setup

Fill required env vars and enforce public-domain guardrails.

```bash
bun install
cp .env.example .env
```

### Build

`bun run build`

### Test

No automated tests yet; validate by MCP smoke call with built-in and voice-clone inputs.

### Lint

`bun run lint`

### Typecheck

`bun run typecheck`

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP bootstrap, env validation, stdio transport |
| `src/tools/generateTtsUrl.ts` | Input validation, TTS call, upload, MCP response |
| `src/lib/provider.ts` | Current TTS backend client |
| `src/lib/storage.ts` | Current S3-compatible storage helper |
| `docs/architecture.md` | End-to-end flow and constraints |

## Agent Guidelines

- Never write to stdout in server code (stdio JSON-RPC safety).
- Return structured JSON in MCP text content for both success and failure.
- Keep public-domain enforcement at startup.
- Do not introduce direct Nexus/STDB calls; keep boundary at URL generation.
- Hosted reference voice sample for cloning workflows: `https://audio.zenon.red/voice/samples/zoe-sample.mp3`.
- For clone calls, pass `voiceSampleUrl` directly, or download and pass `voiceSamplePath`.
