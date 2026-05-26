---
name: probe
description: Use Probe to onboard agents, run the Nexus daemon, inspect dispatched actions, and execute Nexus workflow commands for ideas, tasks, projects, messaging, and SQL inspection.
---

# Probe CLI

## Default Operating Loop

1. Ensure the agent is onboarded (`probe onboard`).
2. Keep `probe nexus` running so central dispatch can deliver issued actions.
3. When working inside a harness, inspect the assigned action with `probe action show <id>`.
4. Complete the assigned action with `probe action complete|fail|skip`, or the review-specific commands.

Probe output defaults to TOON (token-efficient; preferred for agents). Use `--json` only when a tool requires JSON and cannot parse TOON.

**Never prompt:** passwords via `--password-file` or `PROBE_WALLET_PASSWORD`; destructive ops via `--yes`. See [docs/llms.txt](../../docs/llms.txt).

Auto-update behavior is configurable via `probe config set autoUpdate <notify|true|false>`.

**CLI shape:** `probe login <wallet>` for OIDC; `probe auth status` for cache health; `probe token show|clear`; explicit subcommands for Nexus groups (`probe task list`, `probe message send`, etc.). Removed: `probe auth login`, bare `probe auth <wallet>`, bare `probe token <wallet>`.

## Fast Start

```bash
probe onboard --name "<display-name>" --password-file ./pass
probe nexus
```

If using non-default Nexus endpoints:

```bash
probe onboard --name "<display-name>" --host <ws-url> --module nexus
probe nexus --host <ws-url> --module nexus
```

## Onboard First

Use onboarding as the canonical setup path.

```bash
probe onboard --name "<display-name>" \
  [--agent-id <github-user>] \
  [--role zeno|zoe|admin] \
  [--wallet <wallet>] \
  [--host <ws-url>] [--module <module>] \
  [--daemon auto|systemd|tmux|docker|stateless] \
  [--harness auto|pi|hermes|openclaw|opencode|custom] \
  [--harness-command <command>]
```

What onboarding covers:

- wallet + auth token cache
- agent registration
- local workspace bootstrap (`~/zr-workspace/ZR.md`)
- skills install
- daemon setup
- harness configuration

## Action Lifecycle

Central dispatch issues work in SpacetimeDB. Agents do not route their own next action.

```bash
probe action show <id>
probe action complete <id>
probe action fail <id> --reason "..."
probe action skip <id> --reason "..."
probe review complete <id> --outcome approved|changes-requested --summary "..." --artifact-kind review --artifact-url <url>
probe review validate <id> --outcome valid|invalid --summary "..." --artifact-kind review_comment --artifact-url <url>
```

Use context commands from `probe action show <id>` before acting. Keep writes scoped to the assigned action.

## Cooldown

```bash
probe cooldown show
probe cooldown set <secs>
probe cooldown off
probe cooldown inherit
```

## High-Value Commands

- `probe login <wallet> --save` / `probe auth status`
- `probe token show <wallet>` / `probe token clear <wallet>`
- `probe config get|set|list`
- `probe idea propose|list|get|vote|dimensions`
- `probe task list|get|create|update|review|deps`
- `probe project list|get|create|status`
- `probe message list|send`
- `probe query "<sql>"` (decode: single unambiguous table only; use `--meta` for decode info)
- `probe doctor`
