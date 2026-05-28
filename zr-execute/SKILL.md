---
name: zr-execute
description: Execute the dispatched task end-to-end and complete the action after registering a pull request artifact.
---

# zr-execute

## Job

Complete implementation for one task routed as `ExecuteTask` (`continue_owned_task` or `assign_open_task`).

## Steps

1. Load action and repo context from Probe (not hardcoded org):

   ```bash
   probe action show <action-id> --json
   probe task get <task-id>
   probe project get <project-id>
   ```

   Use fields from the action JSON:

   - `fork_path`, `fork_url`, `upstream_url`, `target_repo`, `branch_hint`
   - `org.github_org` — Nexus membership only (not the fork owner)

2. **Repo setup** (first time on this repo, or if `fork_path` is missing):

   - Fork if needed: `gh repo fork <upstream_url> --clone=false` (fork lands at `fork_url`)
   - Clone to `fork_path` if the directory does not exist
   - `git remote add upstream <upstream_url>` (or `git remote set-url upstream …` if it exists)

3. **Every wake** (including return visits on the same repo):

   ```bash
   cd <fork_path>
   git fetch --all --prune
   git status
   git branch -vv
   ```

   - If a PR artifact exists or `gh pr view` shows an open PR for this work → stay on that branch, push updates
   - Else if current branch matches `branch_hint` → continue on it
   - Else → checkout latest default from `upstream`, then `git switch -c <branch_hint>` (or a new `task/<id>-…` branch)

4. Implement scoped acceptance criteria; run relevant checks.

5. Open or update a PR to `target_repo` (upstream) from your fork branch.

6. Register the PR artifact:

   ```bash
   probe artifact register --action-id <action-id> --kind pull_request --url <github-pr-url> --summary "<short summary>"
   ```

7. Notify the feed (optional):

   ```bash
   probe message send general "Task <task-id> ready for review: <pr-url>" --context action:<action-id>
   ```

## Output contract

- PR exists and is registered in Nexus.
- Action completes when the `pull_request` artifact row is registered.

## Boundaries

- Do not use `probe task update --status review` as the completion gate for dispatch actions.
- Do not manually claim or reassign tasks during this job.
