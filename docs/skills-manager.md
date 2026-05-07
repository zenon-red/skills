# Skills Manager

The repository includes a small TypeScript CLI that manages the skill inventory from `meta.json`.

Source:

- `scripts/skills-manager.ts`

Build artifact:

- `dist/skills-manager.mjs`

## What It Does

It provides a single place to manage skill directories in this repository:

- `manual` skills: authored directly in this repo
- `external` skills: copied from another git repository path

The CLI helps with:

- listing configured skills
- bootstrapping missing skill directories
- checking whether external skills are outdated
- syncing external skills to latest upstream commit
- identifying and removing unmanaged skill directories

## How It Is Wired

- `meta.json` is the source of truth.
- `npm run build` compiles the CLI using `tsdown`.
- package scripts execute `node dist/skills-manager.mjs ...`.

## Configuration (`meta.json`)

```json
{
  "skills": {
    "zr-readme": {
      "type": "manual"
    },
    "probe": {
      "type": "external",
      "repo": "https://github.com/zenon-red/probe",
      "source": "skills/probe"
    },
    "voize": {
      "type": "external",
      "repo": "https://github.com/zenon-red/voize",
      "source": "skills/voize"
    }
  }
}
```

Rules:

- key = local directory name in repository root
- `manual` requires only `type`
- `external` requires `repo` and `source`

## Commands

```bash
npm run build                # Compile scripts/skills-manager.ts
npm run skills:list          # List configured skills and type
npm run skills:init          # Create missing manual skills; bootstrap missing external
npm run skills:check         # Compare local external SHAs vs upstream HEAD
npm run skills:sync          # Replace external skills with latest upstream content
npm run skills:cleanup       # Show unmanaged skill directories
npm run skills:cleanup:apply # Delete unmanaged directories
```

Notes:

- `skills:cleanup` only removes directories when run with `--yes` (`skills:cleanup:apply` script includes it).
- `skills:sync` and `skills:check` only affect `external` skills.

## External Skill Metadata

Each synced external skill includes `META.md`:

```md
# Meta

- Type: external
- Source: skills/web-design-guidelines
- Repo: https://github.com/vercel-labs/agent-skills
- SHA: <commit-sha>
- Synced: 2026-02-22
```

This records provenance and lock state for the copied content.

## Typical Maintainer Flow

```bash
npm install
npm run build
npm run skills:list
npm run skills:check
```

When adding or changing entries in `meta.json`:

```bash
npm run build
npm run skills:init
npm run skills:sync
npm run typecheck
```

### Syncing External Skills (probe / voize)

When upstream skills change (e.g. a new `SKILL.md` revision in `zenon-red/probe` or `zenon-red/voize`):

```bash
npm run skills:check      # See which externals have updates
npm run skills:sync       # Pull latest content into local dirs
git add probe/ voize/     # Stage updated skill dirs + META.md
git commit -m "chore: sync upstream skills"
```

Each synced skill directory includes a `META.md` with source repo, path, SHA, and sync date — this is the equivalent of a lock file for vendored external content.
