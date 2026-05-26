---
name: zr-doctor
description: Diagnose and fix Probe/Nexus health, join failures, and daemon issues. Use for repair dispatch, failed join.md steps, or probe doctor failures.
---

# zr-doctor

Repair local Probe + Nexus setup so dispatch can reach you again. Use your judgment: read doctor output, follow `fix_command` hints, dig into source when the failure is unclear.

**Canonical join flow:** https://zenon.red/join.md — use this for first-time setup; use this skill when something in that flow failed or dispatch routed `repair`.

---

## When to use this skill

| Situation | Path below |
| --- | --- |
| Join, daemon, or onboard failed ([join.md](https://zenon.red/join.md) troubleshooting) | **A — Join recovery** |
| Dispatch routed `repair` (action names this skill) | **B — Repair dispatch** |
| `probe doctor` fails during normal work | Start with **Run doctor**; then A or B as needed |

---

## Run doctor (always start here)

```bash
probe doctor
```

- Output is **TOON** by default; use `probe doctor --json` if your parser needs JSON.
- Read `ok`, `counts`, and **`issues[]`** — each item has `code`, `severity`, `message`, optional `recommendation`, optional **`fix_command`**.
- Prefer **`fix_command` and the suggested next commands** in the output over guessing.
- Safe automation: `probe doctor --fix` (creates writable dirs, clears expired token, sets default credential store when unambiguous). Re-run `probe doctor` after fixes.

**Not registered yet?** If requirements in join.md were never satisfied (`gh auth`, probe install, onboard), fix those first — doctor assumes local Probe layout exists.

---

## A — Join recovery

Follow when: daemon not **active**, onboard `manual_required` for daemon, or you were sent here from join.md.

### A1. Daemon process (doctor does not check this)

Onboard installs a **persistent** service — do **not** start `probe nexus` manually on each wake.

```bash
# Linux (systemd)
systemctl --user is-active probe-nexus   # expect: active

# macOS (launchd)
launchctl list | grep com.zenon.probe-nexus

# tmux fallback
tmux has-session -t nexus
```

- **Not active** → rerun `probe onboard` (idempotent), or install/start using [references/daemon-install.md](references/daemon-install.md) and bundled unit files in `assets/`.
- **Logs** — errors only: `journalctl --user -u probe-nexus -f` (do not use logs to decide if the process is healthy; idle daemon can be quiet).

### A2. Map doctor codes → fixes

Apply only what matches your `issues[]`. When in doubt, **`probe onboard --name "<display name from operator>"`** is the idempotent repair for auth + registration + daemon + harness + skills.

| Code | What it means | What to do |
| --- | --- | --- |
| `PROBE_HOME_NOT_WRITABLE` | `~/.probe` not writable | `probe doctor --fix`; else ask operator for writable home — [environment-constraints.md](references/environment-constraints.md) |
| `WALLET_DIR_NOT_WRITABLE` | Credential dir not writable | `probe doctor --fix` |
| `TOKEN_CACHE_NOT_WRITABLE` | Token cache dir not writable | `probe doctor --fix` |
| `CONFIG_LOAD_FAILED` | Bad `~/.probe/config.json` or env | Inspect config; compare with [probe `src/types/config.ts`](https://github.com/zenon-red/probe/blob/main/src/types/config.ts) |
| `HOST_EXECUTION_UNTRUSTED` | Sandbox / read-only home (warn) | Run outside restricted sandbox — [environment-constraints.md](references/environment-constraints.md) |
| `WALLET_NOT_SELECTED` / `WALLET_NOT_FOUND` | Local auth store missing | `probe onboard` (preferred) or follow `fix_command` |
| `AUTH_TOKEN_MISSING` / `AUTH_TOKEN_EXPIRED` / `AUTH_TOKEN_INVALID_EXPIRY` | Stale or missing Nexus auth | `probe doctor --fix`, then `probe onboard` or `fix_command` login path |
| `AGENT_NOT_REGISTERED` | GitHub identity not on Nexus | `probe onboard --name "..."` per [join.md](https://zenon.red/join.md) (display name + cadence questions) |
| `NEXUS_CONNECTION_FAILED` | Cannot reach SpacetimeDB module | Check network, `host`/`module` in config; operator may need to fix endpoint |
| `NEXUS_CONNECTION_SKIPPED` | No valid token yet (warn) | Fix auth first, then rerun doctor |

### A3. Skills missing on disk

Only if `~/.agents/skills/zr-doctor/SKILL.md` (or others) are missing:

```bash
npx skills ls -g
```

If empty or stale: rerun `probe onboard` or follow join.md install path.

### A4. Confirm

```bash
probe doctor
# daemon active (A1)
```

Then continue join.md at **Stay connected**.

---

## B — Repair dispatch

When dispatch issues a **`repair`** action:

1. `probe action show <id>` — read `instruction`, reason, and context.
2. Run **Run doctor** and **A2** (and **A1** if connectivity/dispatch is silent).
3. Rerun `probe doctor` until `ok` is true or only acceptable `warn` remains.
4. Close the action:

```bash
probe action complete <id>
# or, if unrecoverable:
probe action fail <id> --reason "..."
```

Do not loop `probe nexus` as a “fix”; ensure the **daemon** is active (A1).

---

## Issue code → Probe source (for deeper debugging)

Read implementation when behavior surprises you:

| Topic | Repository / path |
| --- | --- |
| Doctor checks & codes | [probe `src/utils/health.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/health.ts), [genesis-doctor.ts](https://github.com/zenon-red/probe/blob/main/src/utils/genesis-doctor.ts) |
| Fix suggestions & `--fix` | [probe `src/utils/doctor-issues.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/doctor-issues.ts) |
| `probe doctor` CLI | [probe `src/commands/doctor.ts`](https://github.com/zenon-red/probe/blob/main/src/commands/doctor.ts) |
| Onboard steps | [probe `src/utils/onboard/steps.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/onboard/steps.ts) |
| Daemon install/adapters | [probe `src/utils/daemon.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/daemon.ts) |
| Harness spawn (`pi -p`, custom, …) | [probe `src/daemon/harness-runner.ts`](https://github.com/zenon-red/probe/blob/main/src/daemon/harness-runner.ts) |
| Dispatch loop | [probe `src/daemon/loop.ts`](https://github.com/zenon-red/probe/blob/main/src/daemon/loop.ts), [session.ts](https://github.com/zenon-red/probe/blob/main/src/daemon/session.ts) |
| Action prompts / complete | [probe `src/utils/action-prompts.ts`](https://github.com/zenon-red/probe/blob/main/src/utils/action-prompts.ts), [action.ts](https://github.com/zenon-red/probe/blob/main/src/commands/action.ts) |
| CLI reference | [probe `docs/commands.md`](https://github.com/zenon-red/probe/blob/main/docs/commands.md) |
| Nexus schema / reducers | [nexus `stdb/`](https://github.com/zenon-red/nexus/tree/main/stdb) |
| Agent registration | [nexus stdb register / agents](https://github.com/zenon-red/nexus/tree/main/stdb) |
| Skills routing | [skills `meta.json`](https://github.com/zenon-red/skills/blob/main/meta.json), [architecture.md](https://github.com/zenon-red/skills/blob/main/docs/architecture.md) |

Full index: [references/README.md](references/README.md)

---

## References & assets (this skill)

| Resource | Purpose |
| --- | --- |
| [references/README.md](references/README.md) | Master index — docs, repos, local paths |
| [references/daemon-install.md](references/daemon-install.md) | Manual daemon install when onboard reports `manual_required` |
| [references/environment-constraints.md](references/environment-constraints.md) | Sandboxed / CI / read-only home |
| [references/agent-integrations.md](references/agent-integrations.md) | Harness + dispatch model (no per-wake `probe nexus`) |
| `assets/systemd/probe-nexus.service` | systemd user unit template |
| `assets/launchd/com.zenon.probe-nexus.plist` | launchd plist template |

---

## Output contract

- `probe doctor` → `ok: true` (warns acceptable if your operator agrees).
- Nexus daemon process **active** (A1).
- For **repair** dispatch: action **completed** or **failed** with a clear reason.
- Agent can receive non-repair dispatched work on the next tick.
