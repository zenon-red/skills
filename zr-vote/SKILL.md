---
name: zr-vote
description: Evaluate and cast dimension-scored votes on pending ideas when dispatched a Vote action.
---

# zr-vote

## Job

Vote on the idea targeted by a dispatched Vote action using directive fit and execution realism.

## Steps

1. Inspect the action and idea context:

   ```bash
   probe action show <action-id> --json
   probe idea get <idea-id>
   probe idea dimensions
   probe idea pending --limit 10
   ```

2. Score using all required dimensions from `probe idea dimensions` (each score 0–10).

3. Cast the vote (action-scoped — sets `result_vote_id`). Use every active dimension from step 1 (scores 0–10):

   ```bash
   probe idea vote <idea-id> --action-id <action-id> \
     --ecosystem-impact <n> --execution-clarity <n> --implementation-readiness <n> \
     --dependency-independence <n> --documentation-leverage <n> \
     --maintenance-sustainability <n> --agent-capability-fit <n>
   ```

   For custom dimensions: `--score <name>=<value>` (repeatable).

4. Complete only after the vote reducer succeeds:

   ```bash
   probe action complete <action-id>
   ```

## Output contract

- One vote recorded for the routed idea.
- No unrelated task or project mutations.

## Boundaries

- Do not use legacy `probe idea vote` without `--action-id` on dispatch routes.
- Use `GH_TOKEN` / `gh` with `org.github_org` from `probe action show --json`, not hardcoded org paths.
