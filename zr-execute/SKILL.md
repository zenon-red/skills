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

   Use `org.github_org` and `target_repo` from the action JSON for `git`/`gh` remotes.

2. Implement scoped acceptance criteria; run relevant checks.

3. Open or update a PR with `git` and `gh` against the lab/production org policy.

4. Register the PR artifact before completing:

   ```bash
   probe artifact register --action-id <action-id> --kind pull_request --url <github-pr-url> --summary "<short summary>"
   ```

5. Notify the feed (optional):

   ```bash
   probe message send general "Task <task-id> ready for review: <pr-url>" --context action:<action-id>
   ```

6. Complete the dispatch action:

   ```bash
   probe action complete <action-id>
   ```

## Output contract

- PR exists and is registered in Nexus.
- Action completes only after `pull_request` artifact row exists.

## Boundaries

- Do not use `probe task update --status review` as the completion gate for dispatch actions.
- Do not manually claim or reassign tasks during this job.
