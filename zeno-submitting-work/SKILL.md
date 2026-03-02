---
name: zeno-submitting-work
description: Use when work is validated and ready to submit, to push to main and create PR for agent review
---

# Submitting Work (Contributor Workflow)

## Overview

Push completed work to main branch and create PR for peer review by other agents. Default workflow assumes main branch work unless ZŌE explicitly requested a different branch.

**Trigger:** Work validated and ready for review

**Output:** Changes pushed to main, PR created, task status updated

## Standard Workflow (Main Branch)

**Step 1: Final Validation**
Already completed via `validating-work` skill - all tests pass.

**Step 2: Commit Changes**

```bash
# Stage changes - be specific
git status
git add src/specific/file.ts tests/specific/test.ts

# Commit with conventional format
git commit -m "feat[scope]: concise description"
# or: git commit -m "fix[scope]: ..."
# or: git commit -m "docs[scope]: ..."
```

**Commit message format:**
- `<type>[scope]: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`
- Scope: component like `stdb`, `backend`, `frontend`
- Description: imperative mood, no period
- Keep under 72 characters

**Git conventions:**
- Never `git add .` - always specify files explicitly
- One logical change per commit
- No generic messages like "updates" or "fixes"
- Conventional commits required

**Step 3: Push to Main**

```bash
# Push to your fork's main (or upstream if you have access)
git push origin main
```

**Step 4: Create PR**

```bash
# Create PR with task context
gh pr create --title "feat[scope]: description" --body "Task #[ID]: [brief description]

## Changes
- [specific change 1]
- [specific change 2]

## Verification
- [x] All tests pass: [test command output summary]
- [x] Component verification complete

## Notes
[Any special considerations for reviewers]"
```

**Step 5: Update Nexus Task**

Update task status to `Review` and link PR:
```
status: Review
github_pr_url: [PR URL]
```

## When ZŌE Requests Different Branch

**Rare case - explicitly requested in task:**

Task description will say: "Work on branch: `feature/name`"

Then:
```bash
# Create and checkout branch
git checkout -b feature/name

# Make changes, commit, push
git push -u origin feature/name

# Create PR
gh pr create --title "..." --body "..."
```

**Default is always main unless explicitly stated.**

## PR Requirements for Agent Review

**Your PR must:**
- Link to Nexus task (in description)
- Include verification evidence
- Be atomic (one logical change)
- Pass all component checks

**PR will be reviewed by:**
- Minimum 3 different Zeno agents
- They check: Does it meet task requirements? Code quality?
- ZŌE validates: Were reviews done? Any concerns raised?

## Anti-Patterns

❌ **Wrong:** Push without creating PR
✅ **Right:** Always create PR for agent review

❌ **Wrong:** Giant PR with multiple unrelated changes
✅ **Right:** Atomic PRs, one task per PR

❌ **Wrong:** "WIP" or incomplete PRs
✅ **Right:** Only submit when ready for review

❌ **Wrong:** Work on feature branch without explicit ZŌE request
✅ **Right:** Default to main branch

❌ **Wrong:** Update task status before PR created
✅ **Right:** Link PR first, then update status to Review

## Integration

**Previous:** `validating-work` (verified completion)
**Next:** Agents use `reviewing-prs` to review your work

## Bottom Line

**Main branch workflow:** Validate → Commit → Push → PR → Update task

Exception: Only use feature branches if ZŌE explicitly requested in task description.
