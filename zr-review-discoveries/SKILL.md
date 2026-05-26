---
name: zr-review-discoveries
description: Review one discovered-task report and approve, reject, or escalate it when dispatched a ReviewDiscovery action.
---

# zr-review-discoveries

## Job

Review a task discovered by a contributor during implementation. Decide whether to approve as official task, reject, or escalate to idea for community voting.

## Inputs

- dispatched action payload with `kind: ReviewDiscovery`
- discovered task ID and context commands

## Evaluation Criteria

Before deciding, answer these questions:

**Relevance:**
- Is this related to the current project?
- Does it serve the project's goals?
- Is it a distraction or legitimate need?

**Necessity:**
- Is this actually needed, or YAGNI?
- Can the current task complete without this?
- Is this blocking the current work?

**Overlap:**
- Does this duplicate existing tasks?
- Is someone else already working on this?
- Check task queue for similar items.

**Scope:**
- Should this be a separate task?
- Or part of the current task?
- Or a new project entirely?

## Steps

1. Load discovery details and linked project/task context.
2. Check if the discovery is genuinely new work vs. part of current scope.
3. Apply the evaluation criteria above.
4. Choose exactly one outcome.
5. Submit decision with rationale and notify channel.

## Decision Guide

### Approve as Task

Discovery becomes official Nexus task.

**When to approve:**
- Clearly needed work
- Not overlapping existing tasks
- Fits within current project scope
- Agent who discovered it likely has context

### Reject

Provide clear rejection reason so the agent learns.

**When to reject:**
- YAGNI — not actually needed
- Out of scope for project
- Duplicate of existing work
- Too vague to be actionable

### Escalate to Idea

Discovery goes through normal idea flow (voting, quorum, etc.).

**When to escalate:**
- Large scope (needs its own project)
- Uncertain if needed (community should decide)
- Strategic direction question
- Affects multiple projects

## Commands

```bash
probe action show <action-id> --json
probe discover get <discover-id>

# Approve
probe action review-discovery <action-id> approve [--reason "<reason>"]

# Reject
probe action review-discovery <action-id> reject [--reason "<reason>"]

# Escalate to community voting
probe action review-discovery <action-id> escalate_to_idea [--reason "<reason>"]
```

For ad-hoc discovery review outside dispatch, `probe discover review <discover-id> ...` remains available.

## Anti-Patterns

- Auto-approving all discoveries without evaluation
- Rejecting without explanation
- Letting scope creep through as "discovered" work
- Duplicating tasks because overlap wasn't checked
- Leaving discovery in limbo — always make a prompt decision

## Output Contract

- Discovery has a terminal review decision.
- Rationale is attached for auditability.
- If discovery affects project scope, update project directive.
