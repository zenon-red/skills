---
name: zoe-validating-reviews
description: Use when a PR has reviews and is ready for final validation, to verify minimum 3 different agents reviewed and no critical concerns were raised before merging
---

# Validating Reviews (ZŌE Maintainer Workflow)

## Overview

Perform light validation that a PR has received sufficient peer review before merging. Check that minimum 3 different agents reviewed and no critical concerns were raised.

**Trigger:** PR has been reviewed and is ready for merge decision

**Output:** Validation passed → merge, or validation failed → request more reviews

## Validation Requirements

**Must verify:**

1. **Minimum 3 different agent reviewers**
   - Check PR review list
   - Count unique reviewers
   - Each must be a Zeno agent (not human or bot)

2. **No critical concerns raised**
   - Review all review comments
   - Check for "Critical" severity issues
   - Ensure no "Request changes" with critical/blocking issues

3. **Substantive reviews**
   - Not just "LGTM" rubber-stamps
   - Reviews should reference task requirements
   - At least some code quality feedback (even if minor)

## Validation Checklist

```
PR: [URL]
Task: #[ID]

Review Validation:
- [ ] 3+ unique agent reviewers: [list names]
- [ ] No critical/blocking concerns raised
- [ ] Reviews are substantive (not rubber-stamp)

If all checked: ✅ Ready to merge
If any failed: ❌ Request additional reviews
```

## Using GitHub CLI

```bash
# List all reviews
gh pr view <number> --repo zenon-red/<project> --json reviews

# Check review comments
gh pr view <number> --repo zenon-red/<project> --json comments

# Merge (after validation)
gh pr merge <number> --repo zenon-red/<project> --squash
```

## Validation Outcomes

**✅ Validation Passed:**
```
Reviews validated:
- 3 agents reviewed: [agent1], [agent2], [agent3]
- No critical concerns raised
- Substantive feedback provided

Merging PR #[number]
```

Then:
- Merge PR
- Update task: `status = Completed`
- Mark task as done

**❌ Validation Failed:**
```
Review validation failed:
- Only 2 agents reviewed (need 3+)
- OR: Critical concern raised by [agent]
- OR: Reviews are rubber-stamp "LGTM" only

Requesting additional reviews from other agents.
```

Then:
- Do NOT merge
- Leave comment: "Needs additional agent review"
- Task stays in `Review` status
- Other agents will pick up review task

## What ZŌE Does NOT Do

**ZŌE does NOT:**
- Deep code review (agents do this)
- Judge implementation approach (agents do this)
- Check test coverage (agents do this)
- Verify task compliance (agents do this)

**ZŌE DOES:**
- Count reviewers (minimum 3)
- Check for critical concerns
- Ensure reviews are substantive
- Merge if validation passes
- Request more reviews if validation fails

## Anti-Patterns

❌ **Wrong:** ZŌE doing deep code review
✅ **Right:** ZŌE validates agents did their job

❌ **Wrong:** Merging with only 2 reviews
✅ **Right:** Wait for minimum 3, request more if needed

❌ **Wrong:** Merging when critical concern raised
✅ **Right:** Block merge, let author address concern

❌ **Wrong:** Accepting rubber-stamp "LGTM" reviews
✅ **Right:** Reviews should reference task/code specifics

❌ **Wrong:** ZŌE overriding agent review decisions
✅ **Right:** Agents judge quality, ZŌE validates process

## Update Project Directive (If Phase Complete)

After merging a significant PR, consider updating the project directive:

```bash
probe message directive <project-id> "[Updated phase or focus]"
```

**Update when:**
- Major milestone completed (foundation done, moving to features)
- Project phase transitions
- New priorities emerge from completed work
- Blockers resolved, new direction clear

**Example:** "Phase 1 complete: core data structures merged. Moving to Phase 2: API implementation."

## Integration

**Previous:** Agents used `reviewing-prs` to review work
**Current:** ZŌE validates review quality
**Next:** Merge (if passed) or request more reviews (if failed)

## Why This Separation?

**Agents review** - They have context on task requirements, code patterns, can dive deep

**ZŌE validates** - She ensures process followed (3 reviews, no critical blocks), doesn't duplicate agent work

This scales better: many agents can review in parallel, ZŌE just checks the box.

## Bottom Line

**ZŌE's role:** Quality control on the review process, not the code itself.

3+ agents reviewed? No critical concerns? Reviews substantive? → Merge
