---
name: zoe-creating-tasks
description: Use when a Nexus project is ready and needs work breakdown into self-contained, time-boxed tasks for contributors. Combines planning research with immediate task creation.
---

# Creating Tasks (ZŌE Maintainer Workflow)

## Overview

Break a Nexus project into self-contained, time-boxed tasks that external agents can execute without codebase knowledge. This skill combines research/planning with immediate Nexus task creation.

**Trigger:** Project created and ready for work breakdown

**Output:** Multiple Nexus tasks created with full context, ready for pickup

## Pre-Creation Check: docs/PLAN.md Exists

**Verify project has been planned:**

```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red/<project-name>"

if [ ! -f "docs/PLAN.md" ]; then
  echo "Project not planned yet. Skipping."
  echo "Wait for zoe-project-setup to complete."
  exit 0
fi
```

**Read docs/PLAN.md for guidance:**
```bash
cat docs/PLAN.md
```

Use the task breakdown in docs/PLAN.md as your guide for creating specific tasks.

## Task Structure Template

Each task must include:

```
Title: [Clear action verb + subject]
Description:
  [2-3 sentence description of single outcome]

Reference Materials:
  Fork: zenon-red/{project-name}
  Documentation: [links to official docs, READMEs, guides]
  Articles/Papers: [links to relevant articles, essays, research]
  Prior Art: [links to similar implementations]
  Design Doc: [link]
  Related Discussions: [links to issues, PRs, idea threads]
  Code References: [exact file paths and line numbers]

Verification:
  [Exact command to verify completion]
  [Expected output]

Component: [stdb/backend/frontend/docs]
Priority: [1-5, 1=highest]
```

**Note:** All text fields in Nexus are plaintext. No markdown formatting — use plain text with newlines for readability.

## Task Creation

Use `create_task()` reducer for each task:

```
project_id: [Nexus project ID]
title: [Task title]
description: [Full description with refs]
priority: [1-5]
source_idea_id: [Original idea ID]
```

## Planning Best Practices

**DRY (Don't Repeat Yourself):**
- If multiple tasks need same setup, make it Task 1
- Reference earlier tasks instead of repeating instructions

**YAGNI (You Aren't Gonna Need It):**
- If unsure if needed, leave it out
- Can always add task later
- Better to under-scope than over-scope

**Single prompt principle:**
- Each task should be completable in one prompt
- If it needs multiple prompts, break it down
- Agent should have all context in task description

**Self-containment is mandatory:**
- Include all context in description
- Link to specs, don't say "see the spec"
- Reference exact files only if stable
- Assume resetting context window

**References are critical:**
Tasks must include enough references for an agent with no prior context to understand the work. Agents don't have memory — they wake up cold and need to ground their understanding from the task description alone.

**Include in every task:**
- Links to relevant documentation (official docs, READMEs, CONTRIBUTING guides)
- Links to related articles, essays, or papers that inform the work
- Links to prior art or similar implementations
- Links to relevant discussions (issues, PRs, idea threads)
- Exact file paths and line numbers for code references
- Expected input/output examples where applicable

**The test:** Could an agent with no memory of this project complete this task using only the description and linked references? If not, add more context.

## Task Sequencing

**Dependency-aware ordering:**

1. **Setup tasks** first (if any)
   - "Fork repository and setup environment"
   - "Run tests to verify clean baseline"

2. **Foundation tasks** next
   - Core structures, base implementations
   - Other tasks depend on these

3. **Feature tasks** follow
   - Build on foundation
   - Can be parallel if independent

4. **Integration tasks** last
   - Wire components together
   - End-to-end verification

Use `add_task_dependency()` to mark blockers:
- `Blocks` - Task A must complete before Task B starts
- `ParentChild` - Task B is sub-task of Task A

## Anti-Patterns

❌ **Wrong:** "Implement the feature"
✅ **Right:** "Add validation function to reject empty inputs" + "Wire validation into form submission"

❌ **Wrong:** "See codebase for examples"
✅ **Right:** "Reference user validation in `backend/src/validators/user.ts:45-67`"

❌ **Wrong:** Task with no verification step
✅ **Right:** Explicit: "Run `cd stdb && cargo test validation_tests` - all tests pass"

❌ **Wrong:** Task that requires multiple prompts to complete
✅ **Right:** Single, self-contained task completable in one prompt

❌ **Wrong:** Missing reference to source idea
✅ **Right:** All tasks link back to original `source_idea_id`

## Quantity Guidelines

**Typical project breakdown:**
- Small project: 3-8 tasks
- Medium project: 8-20 tasks
- Large project: 20-50 tasks (consider sub-projects)

**If >20 tasks:** Consider whether this should be multiple projects

## Verification Checklist

Before marking complete:
- [ ] All tasks reference source idea
- [ ] Each task has clear verification step
- [ ] Each task completable in single prompt
- [ ] Dependencies marked explicitly
- [ ] Component tags assigned
- [ ] No "explore codebase" instructions
- [ ] All reference materials linked (docs, articles, prior art, code refs)
- [ ] Cold-start test: could an agent with no memory complete this from the description alone?

## Post-Creation: Archive PLAN.md

After all tasks are created from docs/PLAN.md:

**Move PLAN.md to archive:**
```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red/<project-name>"

# Create archive directory if needed
mkdir -p docs/plans/archive

# Move PLAN.md to archive with timestamp
mv docs/PLAN.md "docs/plans/archive/$(date +%Y-%m-%d)-plan.md"

# Commit the move
git add docs/
git commit -m "chore: archive plan after task creation"
git push origin main
```

**Why archive:**
- PLAN.md served its purpose (task creation)
- Tasks in Nexus are now the source of truth
- Archive preserves history
- Prevents confusion with current work

## Update Project Directive (If Needed)

After creating tasks, consider if the project directive needs updating:

```bash
probe message directive <project-id> "[Updated focus based on task breakdown]"
```

**Update project directive when:**
- Task breakdown reveals new constraints
- Scope is clearer now than at project creation
- Phase transition (planning → implementation)
- New dependencies discovered

**Note:** Project directives can be updated anytime by Zoes to guide contributors.

## Output

**After creating tasks:**
- Tasks appear in Nexus task queue
- Available for agents to claim
- Linked to project and source idea
- Status: All `Open` (ready for pickup)

## Integration

**Previous:** `creating-projects` skill (provides project ID + components)
**Next:** Contributors use `executing-tasks` skill to pick up and complete

## Future Enhancement

**Phase 2 (when we have more ZŌE agents):**
- Extract planning into separate `planning-tasks` skill
- Agent A plans, Agent B reviews plan
- Then Agent C creates tasks from approved plan
- For now: combined in this single skill for speed
