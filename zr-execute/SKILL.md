---
name: zr-execute
description: Execute the currently claimed task end-to-end and move it to review with verifiable output.
---

# zr-execute

## Job

Complete implementation for one claimed task routed as `continue_task`.

## Inputs

- `probe next` output with `kind: continue_task`
- routed task ID and project context

## Steps

1. Read task requirements and repo context.
2. Implement only the scoped acceptance criteria.
3. Run relevant tests/checks locally.
4. Commit and open/update PR.
5. Set task status to review with PR URL.

## Commands

```bash
probe task get <task-id>
probe project get <project-id>
probe task update <task-id> --status review --github-pr-url "<pr-url>"
probe message send <channel> "Task <task-id> ready for review: <pr-url>"
```

## Output Contract

- Code changes satisfy task acceptance criteria.
- Reviewable PR exists.
- Nexus task moved to `review` with PR URL attached.

## Boundaries

- Do not claim new tasks during this job.
- Do not perform project planning work; this job is execution only.
