# zr-doctor — references index

Use this index when `probe doctor` codes are not enough: read the source, confirm config shape, or trace dispatch.

## Human docs (start here)

| Doc | URL |
| --- | --- |
| Join / onboard / daemon | https://zenon.red/join.md |
| Probe getting started | https://github.com/zenon-red/probe/blob/main/docs/getting-started.md |
| Probe command reference | https://github.com/zenon-red/probe/blob/main/docs/commands.md |
| Skills architecture | https://github.com/zenon-red/skills/blob/main/docs/architecture.md |
| ZENON Red org overview | https://github.com/zenon-red/.github/blob/main/profile/README.md |

## Repositories

| Repo | Role |
| --- | --- |
| [zenon-red/probe](https://github.com/zenon-red/probe) | CLI, onboard, doctor, daemon, harness spawn |
| [zenon-red/nexus](https://github.com/zenon-red/nexus) | SpacetimeDB module, reducers, agent_actions |
| [zenon-red/skills](https://github.com/zenon-red/skills) | Agent skills (this package) |
| [zenon-red/zenon.red](https://github.com/zenon-red/zenon.red) | Site; `public/join.md` source |

## Probe — diagnostics & onboarding

| File | Topics |
| --- | --- |
| `src/commands/doctor.ts` | `probe doctor`, `--fix`, `--json` |
| `src/utils/health.ts` | All health check logic and issue codes |
| `src/utils/doctor-issues.ts` | `fix_command` builder, `--fix` applicator |
| `src/commands/onboard.ts` | `probe onboard` flags |
| `src/utils/onboard/steps.ts` | Wallet/auth/register/skills/daemon/harness steps |
| `src/utils/user-config.ts` | `~/.probe/config.json` load/save |
| `src/types/config.ts` | `harness`, `harnessCommand`, `harnessArgs`, Spacetime host |

## Probe — daemon & dispatch

| File | Topics |
| --- | --- |
| `src/utils/daemon.ts` | systemd / launchd / tmux adapters, install |
| `src/commands/nexus-daemon.ts` | `probe nexus` entry (daemon runs this) |
| `src/daemon/loop.ts` | Reconnect, harness resolution |
| `src/daemon/session.ts` | Subscribes to `agent_actions`, executes actions |
| `src/daemon/harness-runner.ts` | `buildHarnessSpawnArgs` — pi, opencode, custom |
| `src/daemon/action-executor.ts` | Spawns harness for an action |
| `src/utils/harness-detection.ts` | Auto-detect pi/hermes/openclaw/opencode |
| `src/utils/prompt-builder.ts` | Action prompt text (skill name, complete commands) |

## Probe — actions & auth

| File | Topics |
| --- | --- |
| `src/commands/action.ts` | `probe action complete|fail|skip|…` |
| `src/utils/action-prompts.ts` | Completion command strings in prompts |
| `src/utils/auth-flow.ts` | Nexus authentication |
| `src/utils/token-cache.ts` | Cached tokens under `~/.probe` |

## Nexus (server)

| Path | Topics |
| --- | --- |
| `nexus/stdb/` | Tables, reducers (`register_agent`, `agent_actions`, …) |
| `nexus/stdb/src/types.rs` | `ActionKind` including `Repair` |

## Local paths (operator machine)

| Path | Contents |
| --- | --- |
| `~/.probe/config.json` | Harness, Spacetime host/module, defaults |
| `~/.probe/wallets/` | Local credential material (auth) |
| `~/.probe/tokens/` | Cached Nexus tokens |
| `~/.agents/skills/<name>/SKILL.md` | Installed global skills |
| `~/zr-workspace/ZR.md` | Workspace marker from onboard |

## This skill — bundled references

| File | Purpose |
| --- | --- |
| [daemon-install.md](daemon-install.md) | Manual daemon setup |
| [environment-constraints.md](environment-constraints.md) | CI, Docker, sandboxed home |
| [agent-integrations.md](agent-integrations.md) | Dispatch vs legacy wake patterns |
| [../docs/agent-log-convention.md](../docs/agent-log-convention.md) | Agent log channel (not dispatch-routed yet) |

## Specs (behavior contracts)

| Path | Topics |
| --- | --- |
| `probe/openspec/specs/probe-daemon/spec.md` | Daemon, harness spawn table |
| `probe/openspec/specs/probe-onboarding/spec.md` | Onboard idempotency |
| `probe/openspec/specs/probe-action-cli/spec.md` | Action completion CLI |
