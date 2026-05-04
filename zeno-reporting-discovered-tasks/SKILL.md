---
name: zeno-reporting-discovered-tasks
description: Use when you find additional work needed during task execution that's not in the original task description, to report it to ZŌE for review
---

# Reporting Discovered Tasks (Contributor Workflow)

## Overview

During task execution, you may discover additional work that's needed but not in your current task. Report these discoveries to ZŌE for review instead of expanding your current task scope.

**Trigger:** Found work that:
- Is not in current task description
- Is needed for project success
- Would expand current task scope

**Output:** Discovery report in Nexus for ZŌE review

## When to Report (vs. Just Do It)

**Report to ZŌE when:**
- Work is clearly outside current task scope
- Might be already planned elsewhere
- Uncertain if actually needed (YAGNI check)
- Large enough to be its own task
- Blocks your current work but not your responsibility

**Just do it (in current task) when:**
- Small addition (< 10 min)
- Clearly required for your task to complete
- No design decisions needed
- Won't expand scope significantly

**Use judgment:** When in doubt, report. ZŌE can always say "include it."

## Discovery Report Structure

Use `probe discover report`:

```bash
probe discover report \
  --task <current-task-id> \
  --project <project-id> \
  --title "[Clear action description]" \
  --type [bug|improvement|feature] \
  --severity [low|medium|high|critical]
```

## Report Quality Checklist

**Before submitting:**

1. **Search existing tasks** - Is this already reported?
   - Check task queue for similar items
   - Avoid duplicates

2. **Check current task** - Is this actually out of scope?
   - Re-read your task description
   - Sometimes it's within scope, just not obvious

3. **Clear description** - Can ZŌE understand without your context?
   - What you were doing
   - What you found
   - Why it matters

4. **Appropriate severity:**
   - **Critical** - Blocks current work, system broken
   - **High** - Should be done soon, significant impact
   - **Medium** - Nice to have, moderate impact
   - **Low** - Minor improvement, small impact

## Examples

**Good Discovery Report:**
```
Context: Working on Task #42 (Add user validation), implementing 
         email format check in backend/src/validators/user.ts

Discovery: The password validation is scattered across 3 files 
           with inconsistent rules. No single source of truth.

Why Needed: If we fix email validation but leave password as-is,
            we have inconsistent security posture. Should consolidate.

Impact: Inconsistent validation leads to security holes and 
        maintenance burden. Every auth change touches 3+ files.

Severity: Medium
Priority: 3
```

**Bad Discovery Report:**
```
Found some stuff that needs fixing in the auth code.
Should probably clean it up.
Severity: Medium
```

## After Reporting

**Continue your current task:**
- Don't wait for ZŌE decision
- Assume discovery won't be part of your current work
- Complete your assigned task as scoped

**Possible outcomes:**
1. **Approved** → New task created, you can claim it if you want
2. **Rejected** → ZŌE explains why not needed, you learned
3. **Escalated** → Becomes idea, you can vote on it

## Anti-Patterns

❌ **Wrong:** Include discovered work in current task scope creep
✅ **Right:** Report it, let ZŌE decide if it's separate task

❌ **Wrong:** Vague description: "found some issues"
✅ **Right:** Specific: "inconsistent validation across 3 files"

❌ **Wrong:** Every small thing discovered gets reported
✅ **Right:** Judgment - report scope expansions, do small necessities

❌ **Wrong:** Assume discovered work is highest priority
✅ **Right:** Let ZŌE assess priority in context of all work

❌ **Wrong:** Stop current task to wait for discovery review
✅ **Right:** Continue current task, review happens async

## Remember

- **Scope discipline** - Your task is your task
- **Don't assume** - What you found might not be needed
- **Clear context** - ZŌE wasn't there, explain fully
- **Continue working** - Don't block on review
- **Learn from feedback** - ZŌE's decision teaches you what matters

## Integration

**Previous:** You're using `zeno-executing-tasks` skill
**Current:** Found something outside scope
**Next:** This skill reports it, then back to `zeno-executing-tasks` to complete original work

**ZŌE side:** Uses `zoe-reviewing-discovered-tasks` skill to review your report
