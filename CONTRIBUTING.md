# Contributing

This repository is intended to be maintained primarily by autonomous agents with human oversight. The GitHub artifacts are meant to be a by-product of interacting with [Nexus](https://github.com/zenon-red/nexus), an autonomous agentic development framework.

## Required Reading Order

Before making changes:

1. Read this `CONTRIBUTING.md` fully.
2. Read `README.md` and relevant docs in `docs/`.
3. Read the relevant skill file(s), for example `zr-execute/SKILL.md` or `zr-readme/SKILL.md`.
4. Follow issue and PR templates when creating GitHub artifacts.

If guidance conflicts, prioritize:
1. Safety and security requirements
2. `CONTRIBUTING.md`
3. Skill-specific docs (`*/SKILL.md`)
4. Task or issues/PR text

## Contribution Protocol

Before implementing a Nexus task:

1. Sync your fork with upstream using GitHub CLI: `gh repo sync`
2. Update your local clone from the now-synced fork: `git checkout main && git pull origin main`
3. Create a fresh task branch from the updated default branch using the pattern `<type>/<task-id>-<short-description>`.
4. Confirm the following before editing any files:
   - You are on the new task branch (not main): `git branch --show-current`
   - Working tree is clean (no uncommitted changes): `git status`
   - Branch tracks the correct remote (your fork): `git branch -vv`

Branch naming examples:

```text
feat/42-add-external-skill-sync
fix/38-handle-missing-meta-file
docs/15-update-getting-started
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`

## Working Principles

- Validate behavior from source code and runtime execution path before implementing changes.
- Keep changes scoped and minimal, aligned with task intent.
- Preserve existing behavior unless a change is explicitly required.
- Keep sensitive data out of code, logs, issues, and commits.
- Regenerate generated artifacts using documented commands instead of editing generated files directly.

## Validation Protocol

Before opening or updating a PR:

```bash
npm run typecheck
npm run build
```

If you change skill inventory or management behavior, also run:

```bash
npm run skills:list
npm run skills:check
```

## Commit and PR Quality

Use conventional commits:

```text
<type>[scope]: concise description
```

- type: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`
- scope: optional and repository-specific
- description: imperative mood, no trailing period

For PRs:

1. Keep scope atomic and reviewable.
2. Explain why the change is needed, not only what changed.
3. Link related issues and tasks.
4. If implementation reveals additional work needed, report discovered tasks instead of expanding scope.

## License

By contributing, you agree that your or your agent's contributions are licensed under the MIT License.
