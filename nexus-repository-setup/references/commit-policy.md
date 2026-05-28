# Nexus Commit Policy

Org-wide rules enforced on every commit via the `.husky/pre-commit` hook.

## How It Works

The pre-commit hook reads `.github/nexus-commit-policy.md` and prints it to the agent's terminal on the first commit attempt. The commit is blocked. The agent follows the policy, stages fixes, and commits again — this time the hook passes.

### Flow

```
git commit → hook: no marker → print policy, create .git/.agent-instructions-pending, exit 1
agent reads policy, follows it, stages changes
git commit → hook: marker exists → delete marker, exit 0
```

### Files

| File | Tracked | Purpose |
|------|---------|---------|
| `.husky/pre-commit` | Yes | Hook script (generic, reads the policy file) |
| `.github/nexus-commit-policy.md` | Yes | The policy content (repo-customizable) |
| `.git/.agent-instructions-pending` | No | Marker file (lives in `.git/`, auto-managed) |

## Customizing Per Repo

The default policy in `nexus-template` covers deslop (code, docs, scratchpads) and output quality. Repos can add repo-specific rules by editing `.github/nexus-commit-policy.md`.

To disable the commit policy hook, delete `.github/nexus-commit-policy.md` — the hook passes through when the file doesn't exist.

## Default Policy Sections

### Deslop

- Code: unnecessary comments, defensive checks, `any` casts, deep nesting
- Documentation: triplication, decision archaeology, filler phrases, verbose trees, marketing language, ASCII art
- Scratchpad: stale notes, temp files, superseded PRDs

### Output Quality

- Comments only for non-obvious behavior or public APIs
- No scratchpad files staged
- Concise, purposeful changes
- No redundant changes
