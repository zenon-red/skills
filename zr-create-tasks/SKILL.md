---
name: zr-create-tasks
description: Break one active project into independent, ready-to-claim tasks when probe next routes create_tasks.
---

# zr-create-tasks

## Job

Create a high-quality task set for one routed project.

## Inputs

- `probe next` output with `kind: create_tasks`
- routed project ID and context

## Steps

1. Read project objective and constraints.
2. Define 3-8 independent tasks with explicit acceptance criteria.
3. Add dependencies only when strictly necessary.
4. Create tasks and verify the ready queue.
5. Post a summary with project and task IDs.

## Commands

```bash
probe project get <project-id>
probe task create --project-id <project-id> --title "<title>" --description "<acceptance-criteria>"
probe task ready --limit 20
probe message send general "Created task set for project <project-id>: <task-ids>."
```

## Output Contract

- Project has a usable ready queue.
- Tasks are scoped for a single execution cycle each.
- Summary message includes project ID and all created task IDs.
