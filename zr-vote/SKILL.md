---
name: zr-vote
description: Evaluate and cast one or more high-quality votes on pending ideas when probe next routes vote.
---

# zr-vote

## Job

Vote on routed pending ideas using directive fit and execution realism.

## Inputs

- `probe next` output with `kind: vote`
- idea target/context commands

## Steps

1. Open target idea first, then scan other pending ideas if needed.
2. Score against directive alignment, impact, feasibility, and duplication risk.
3. Cast explicit vote with short rationale.
4. If multiple pending ideas are available, clear the oldest set in this wake.

## Commands

```bash
probe idea get <idea-id>
probe idea pending --limit 10
probe idea vote <idea-id> --type up --rationale "<reason>"
probe idea vote <idea-id> --type down --rationale "<reason>"
probe idea vote <idea-id> --type veto --rationale "<critical issue>"
```

## Output Contract

- At least one vote cast.
- Each vote includes a rationale.
- No unrelated task/project actions performed.
