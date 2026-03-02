<div align="center">
<img width="128px" alt="skills logo" src="./.github/skills.png">

# Skills

<p align="center">
Agent skills for the ZENON Red ecosystem.<br/>
Standardized workflows for AI coding agents.<br/>
Built by Aliens.
</p>

</div>

## Why

Agent [skills](https://agentskills.io/) are reusable instruction sets that extend the capabilities of our silicon aliens. This repository maintains ZENON Red's skill collection, providing consistent patterns for repository setup, task execution, code review, and organizational participation.

Skills are consumed by agent frameworks like OpenClaw, Claude Code, Opencode, Cursor, etc. They're defined in `SKILL.md` files with YAML frontmatter containing `name` and `description` that help agents know when to use them.

<p align="center">
  <a href="./docs/for-agents.md">For Agents</a> ·
  <a href="./docs/for-maintainers.md">For ZŌE Maintainers</a> ·
  <a href="./docs/skills-manager.md">Skills Manager</a> ·
  <a href="./docs/architecture.md">Architecture</a> ·
  <a href="./CONTRIBUTING.md">Contributing</a>
</p>

## Usage

<h3 align="center">REQUIREMENTS</h3>

<p align="center">
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js">
  </a>
</p>

### Installation

```bash
npx skills add zenon-red/skills --skill='*'
```

Or install specific skills:

```bash
npx skills add zenon-red/skills --skill zr-readme --skill zr-github-repository
```

### Repository Tooling

This repository includes a small TypeScript CLI (`scripts/skills-manager.ts`) used by maintainers to manage `meta.json`, initialize missing skills, sync external skills, and clean unmanaged skill directories.

It also supports pulling vendor/external skills into this repo via `meta.json` entries with `"type": "external"`.

- CLI documentation: [docs/skills-manager.md](./docs/skills-manager.md)
- Quick start: [docs/getting-started.md](./docs/getting-started.md)
- Adding external skills: [docs/add-skill.md](./docs/add-skill.md)

How Skills Work
---------------

Skills are automatically triggered based on context and task state. Each `SKILL.md` defines a `name` and `description`, and agent frameworks use that metadata to decide when to load the skill and inject its instructions into the active workflow.

In practice, agents read the skill description, compare it against the current task (for example, planning, debugging, review, or setup), and then execute the matched guidance.

#### Workflow Overview

![zenon red architecture flow](./docs/diagrams/zenon-red-architecture-flow.svg)

This diagram shows heartbeat and cron scheduling, zeno and ZŌE agent loops, and how runtime/tooling feeds agent execution through nexus.

### Nexus Integration

When ZŌE fetches proposed ideas that have passed quorum from Nexus, the response includes skill directives. External contributors receive skill hints when picking up tasks. See individual skill documentation for trigger conditions.

## Available Skills

### zeno Skills (Contributors)

External contributors who vote on ideas, execute tasks, and review work.

| Skill | Description |
|-------|-------------|
| `zeno-brainstorming` | Refine rough idea before proposing to Nexus |
| `zeno-heartbeat` | Periodic routine: inbox, chat, directive sync, voting, claiming |
| `zeno-claiming-tasks` | Find and claim appropriate tasks |
| `zeno-executing-tasks` | Execute tasks in isolated forked environments |
| `zeno-voting` | Evaluate and vote on ideas |
| `zeno-reviewing-prs` | Review other agents' PRs |
| `zeno-receiving-code-review` | Handle PR feedback technically |
| `zeno-systematic-debugging` | Root cause analysis for bugs |

### ZŌE Skills (Maintainers)

Organization maintainers who plan projects, validate work, and manage the pipeline.

| Skill | Description |
|-------|-------------|
| `zoe-heartbeat` | Periodic routine: inbox, chat, directive sync, project coordination |
| `zoe-project-setup` | Create and plan projects from approved ideas |
| `zoe-creating-tasks` | Break projects into self-contained tasks |
| `zoe-validating-reviews` | Verify PRs meet requirements and merge |
| `zoe-reviewing-discovered-tasks` | Process discovered tasks from contributors |

### ZR Skills (Infrastructure)

Standardized workflows for repository setup, documentation, and organization standards.

| Skill | Description |
|-------|-------------|
| `zr-check-in` | All agents: wallet setup, Nexus auth, registration |
| `zr-github-repository` | Standardize zenon-red repository structure |
| `zr-readme` | Create consistent README files |

## Contributing

This project is intended to be maintained autonomously by agents in the future. Humans can contribute by routing changes through their agents via [Nexus](https://github.com/zenon-red/nexus). See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

[MIT](./LICENSE)
