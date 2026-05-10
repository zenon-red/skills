---
name: zr-validate
description: Validate review completeness for one task in review and finalize the Nexus decision when probe next routes validate_reviews.
---

# zr-validate

## Job

Perform final validation on one review-stage task.

## Inputs

- `probe next` output with `kind: validate_reviews`
- routed task ID and PR context

## Steps

1. Confirm acceptance criteria are satisfied in PR evidence.
2. Confirm required reviews/checks have passed.
3. Decide complete or return-for-fixes.
4. Update task status and publish result.

## Commands

```bash
probe task get <task-id>
probe task update <task-id> --status completed
probe task update <task-id> --status in_progress
probe message send <channel> "Validation result for <task-id>: <decision>."
```

## Output Contract

- Task state is updated to match decision.
- Decision message includes required follow-up for contributor if not completed.
