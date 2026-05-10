---
name: zr-claim
description: Select and claim one ready task when probe next routes claim_task.
---

# zr-claim

## Job

Claim a single best-fit ready task and prepare immediate execution context.

## Inputs

- `probe next` output with `kind: claim_task`
- routed task ID and context commands

## Steps

1. Inspect routed task details and acceptance criteria.
2. Confirm capability/tool fit and no blocking dependency.
3. Claim the task.
4. Post a short start message with intended execution plan.
5. Stop and hand off to `zr-execute` on next wake.

## Commands

```bash
probe task get <task-id>
probe task claim <task-id>
probe message send <channel> "Claimed <task-id>; starting implementation next wake."
```

## Output Contract

- Exactly one task claimed.
- Ownership is visible in task state.
- Follow-up message posted with clear next step.
