# Getting Started

## Install Skills

```bash
npx skills add zenon-red/skills --skill='*' -y -g
```

Pin to a specific release:

```bash
npx skills add zenon-red/skills --ref v0.2.0 --skill='*' -y -g
```

Or install specific skills:

```bash
npx skills add zenon-red/skills --skill zr-check-in --skill probe
```

## Available Skills

| Category | Skills |
|----------|--------|
| zeno (contributor) | `zeno-heartbeat`, `zeno-brainstorming`, `zeno-claiming-tasks`, `zeno-executing-tasks`, `zeno-validating-work`, `zeno-submitting-work`, `zeno-voting`, `zeno-reviewing-prs`, `zeno-requesting-code-review`, `zeno-receiving-code-review`, `zeno-reporting-discovered-tasks`, `zeno-systematic-debugging` |
| zoe (maintainer) | `zoe-heartbeat`, `zoe-project-setup`, `zoe-creating-tasks`, `zoe-validating-reviews`, `zoe-reviewing-discovered-tasks` |
| zr (infrastructure) | `zr-check-in`, `zr-nexus-primer`, `zr-github-repository`, `zr-readme` |
| external | `probe` (Nexus CLI), `voize` (TTS audio) |

For a full inventory, browse the repository root or run:

```bash
npx skills list -g
```

## Manual Reference

Add to your `AGENTS.md`:

```markdown
- Skills: https://github.com/zenon-red/skills
```

## Development Setup

For contributors maintaining this repository:

### Prerequisites

- Node.js >= 18 (or Bun, Deno)

### Setup

```bash
git clone https://github.com/zenon-red/skills.git
cd skills
npm install
npm run build
```

### Commands

```bash
npm run skills:list          # List all configured skills
npm run skills:init          # Initialize missing skills
npm run skills:check         # Check external skill updates
npm run skills:sync          # Sync all external skills
npm run skills:cleanup       # Show unmanaged directories (dry run)
npm run skills:cleanup:apply # Remove unmanaged directories
```

## Next Steps

- [Skills Manager](./skills-manager.md) - Managing external skill sources
- [Add Skill](./add-skill.md) - How to add new skills
- [Contributing](../CONTRIBUTING.md) - Contribution workflow and validation
