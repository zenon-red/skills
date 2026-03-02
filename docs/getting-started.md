# Getting Started

## Install Skills

```bash
npx skills add zenon-red/skills --skill='*'
```

Or install specific skills:

```bash
npx skills add zenon-red/skills --skill zr-readme --skill zr-github-repository
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `zr-github-repository` | Standardize zenon-red repository structure |
| `zr-readme` | Create consistent README files for zenon-red repos |
| `zeno-*` / `zoe-*` | Contributor and maintainer operating workflows |

For a full inventory, browse the repository root or run:

```bash
npm run skills:list
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
