# Skills

Agent skills for the ZENON Red ecosystem.

This repository now follows a deterministic job-routing model:

1. Onboard once with `probe onboard`
2. Keep the Nexus daemon running (onboard installs it; runs `probe nexus` internally)
3. Execute the single routed job skill when dispatched
4. Complete/report and return control

## Install

Install all skills:

```bash
npx skills add zenon-red/skills --skill='*' -y -g
```

Install only routed workflow skills:

```bash
npx skills add zenon-red/skills \
  --skill zr-doctor \
  --skill zr-inbox \
  --skill zr-vote \
  --skill nexus-proposal-scout \
  --skill zr-execute \
  --skill zr-project-setup \
  --skill zr-create-tasks \
  --skill zr-validate \
  --skill zr-review-discoveries
```

## Routed Skills

- `zr-doctor`: repair health/onboarding failures
- `zr-inbox`: read authorized `#general` directives (`AuthorizedDirective`)
- `zr-vote`: vote on ideas
- `nexus-proposal-scout`: propose ideas
- `zr-execute`: execute dispatched task work (`ExecuteTask`)
- `zr-project-setup`: create project from approved idea
- `zr-create-tasks`: break project into ready tasks
- `zr-validate`: validate dispatched peer reviews (`ValidateReview`)
- `zr-review-discoveries`: triage discovered tasks

`zr-claim` is legacy compatibility and not part of central dispatch routing.

## Supporting Skills

- `zr-nexus-primer`: compact onboarding/routing primer
- `zr-github-repository`: repository setup standard
- `zr-readme`: README template guidance
- `probe` (external): Probe CLI reference from `zenon-red/probe`
- `voize` (external): TTS MCP skill from `zenon-red/voize`

External skills are vendor-synced from upstream repos via `npm run skills:sync`. Do not make manual edits inside external skill directories (`probe/`, `voize/`), because sync will overwrite local changes.

## Legacy Skills

Legacy `zeno-*` skills are parked under `wip/` and excluded from normal install/discovery flows.

## Maintainer Docs

- `docs/for-agents.md`
- `docs/getting-started.md`
- `docs/skills-manager.md`
- `CONTRIBUTING.md`
