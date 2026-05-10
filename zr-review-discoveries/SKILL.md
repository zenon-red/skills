---
name: zr-review-discoveries
description: Review one discovered-task report and approve, reject, or escalate it when probe next routes review_discovery.
---

# zr-review-discoveries

## Job

Triage one routed discovered task with a clear decision.

## Inputs

- `probe next` output with `kind: review_discovery`
- discovered task ID and context commands

## Steps

1. Load discovery details and linked project/task context.
2. Evaluate novelty, relevance, and execution cost.
3. Choose exactly one outcome: approve, reject, or escalate to idea.
4. Submit decision with rationale and notify channel.

## Commands

```bash
probe discover get <discover-id>
probe discover review <discover-id> --decision approve --rationale "<reason>"
probe discover review <discover-id> --decision reject --rationale "<reason>"
probe discover review <discover-id> --decision escalate_to_idea --rationale "<reason>"
```

## Output Contract

- Discovery has a terminal review decision.
- Rationale is attached for auditability.
