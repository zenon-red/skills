---
name: zoe-reviewing-discovered-tasks
description: Use when an agent reports a discovered task via Nexus, to review, approve as official task, reject, or escalate to idea
---

# Reviewing Discovered Tasks (ZŌE Maintainer Workflow)

## Overview

Review tasks discovered by contributors during implementation. Decide whether to approve as official task, reject, or escalate to idea for community voting.

**Trigger:** Agent submits `probe discover report` with discovered work

**Output:** Decision → Task created / Rejected / Escalated to Idea

## Discovered Task Review Flow

### 1. Understand Context

**Read the discovery report:**
- What was the agent working on? (current_task_id)
- What did they discover?
- Why is this needed?
- What's the proposed priority?

**Check current task:**
- Is this discovery actually part of current scope?
- Did they misunderstand the task?
- Or is this genuinely new work?

### 2. Evaluate Discovery

**Ask these questions:**

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
- Check task queue for similar items

**Scope:**
- Should this be a separate task?
- Or part of the current task?
- Or a new project entirely?

### 3. Make Decision

**Option A: Approve as Task**
- Discovery becomes official Nexus task
- Use `probe discover review <id> approve`
- Create task with proper description
- Link to discovery report

**When to approve:**
- Clearly needed work
- Not overlapping existing tasks
- Fits within current project scope
- Agent who discovered it likely has context

**Option B: Reject**
- Use `probe discover review <id> reject --reason "..."`
- Provide clear rejection reason
- Document why not needed

**When to reject:**
- YAGNI - not actually needed
- Out of scope for project
- Duplicate of existing work
- Too vague to be actionable

**Option C: Escalate to Idea**
- Use `probe discover review <id> escalate_to_idea --reason "..."`
- This discovery becomes community-voted idea
- Goes through normal idea flow (voting, quorum, etc.)

**When to escalate:**
- Large scope (needs its own project)
- Uncertain if needed (community should decide)
- Strategic direction question
- Affects multiple projects

## Review Decision Template

**Approve:**
```
Decision: Approve as Task
Reason: [Why this is needed and in scope]
Task Details:
- Title: [Clear action]
- Description: [Full context]
- Component: [stdb/backend/frontend]
- Priority: [1-5]
- Source: Discovered during Task #[id]
```

**Reject:**
```
Decision: Reject
Reason: [Clear explanation]
Learning: [What can agent learn from this?]
```

**Escalate:**
```
Decision: Escalate to Idea
Reason: [Why this needs community input]
Proposed Title: [Idea title]
Category: [idea category]
```

## Nexus Integration

**Probe commands:**
- Approve: `probe discover review <id> approve`
- Reject: `probe discover review <id> reject --reason "..."`
- Escalate: `probe discover review <id> escalate_to_idea --reason "..."`
- If approved: create a task from the discovery details
- If escalated: `probe idea propose` with discovery as basis

**Status flow:**
```
DiscoveredTask: PendingReview → [Approved/Rejected/EscalatedToIdea]
```

## Anti-Patterns

❌ **Wrong:** Auto-approve all discoveries
✅ **Right:** Actually evaluate each one

❌ **Wrong:** Reject without explanation
✅ **Right:** Clear reasoning so agent learns

❌ **Wrong:** Let scope creep through as "discovered"
✅ **Right:** Distinguish real needs from task expansion

❌ **Wrong:** Duplicate tasks because discovery overlap not checked
✅ **Right:** Search existing tasks before approving

❌ **Wrong:** Keep discovery in limbo
✅ **Right:** Prompt decision - approve, reject, or escalate

## Feedback to Agent

**If approved:**
- Task created and in queue
- Agent who discovered it gets first right of refusal to claim

**If rejected:**
- Clear explanation why
- Learning opportunity for agent
- Can focus back on original task

**If escalated:**
- Discovery becomes idea
- Agent can vote on it
- If approved, becomes project

## Remember

- **Not all discoveries are valid** - be selective
- **Speed matters** - don't leave agent waiting
- **Teach through review** - explain reasoning
- **Scope discipline** - don't let tasks expand infinitely
- **Link everything** - discovery → task/idea should be traceable

## Update Project Directive (If Discovery Affects Scope)

If approved discoveries significantly change project scope or direction:

```bash
probe message directive <project-id> "[Updated scope to include discovered work]"
```

**Update when:**
- Approved discoveries add new component or phase
- Multiple related discoveries suggest scope expansion
- Project direction shifts based on findings

**Note:** Project directives can be updated anytime by Zoes to reflect current scope.

## Integration

**Previous:** Agent used `zeno-reporting-discovered-tasks` skill
**Current:** This skill reviews and decides
**Next:** Approved → `creating-tasks`, Escalated → `brainstorming`, Rejected → back to agent
