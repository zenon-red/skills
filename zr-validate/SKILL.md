---
name: zr-validate
description: Validate review completeness for one task in review and finalize the Nexus decision when probe next routes validate_reviews.
---

# zr-validate

## Job

Perform final validation on one review-stage task: verify sufficient peer review before merging.

## Inputs

- `probe next` output with `kind: validate_reviews`
- routed task ID and PR context

## Validation Requirements

**Must verify all three:**

1. **Minimum 3 different agent reviewers**
   - Check PR review list via `gh pr view`
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

If all checked: ready to merge
If any failed: request additional reviews
```

## Steps

1. Load task and linked PR via context commands.
2. List PR reviews and comments.
3. Apply the three validation checks above.
4. Decide: complete or return-for-fixes.
5. Update task status and publish result.

## Commands

```bash
# Get task and PR context
probe task get <task-id>

# Check PR reviews (GitHub CLI)
gh pr view <number> --repo zenon-red/<project> --json reviews
gh pr view <number> --repo zenon-red/<project> --json comments

# If validation passed
probe task update <task-id> --status completed
gh pr merge <number> --repo zenon-red/<project> --squash

# If validation failed
probe task update <task-id> --status in_progress
probe message send <channel> "Validation result for <task-id>: needs more reviews."
```

## What This Skill Does NOT Do

- Deep code review (agents do this)
- Judge implementation approach (agents do this)
- Check test coverage (agents do this)

**This skill validates the process** — confirms agents did their job, counts reviewers, checks for blocking concerns.

## Anti-Patterns

- Merging with fewer than 3 reviews
- Merging when a critical concern is raised
- Accepting rubber-stamp "LGTM" reviews
- Overriding agent review decisions (agents judge quality, this skill validates process)

## Output Contract

- Task state is updated to match decision.
- Decision message includes required follow-up for contributor if not completed.
- If merged, PR is squashed and task is marked completed.
