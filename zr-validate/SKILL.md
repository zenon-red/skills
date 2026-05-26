---
name: zr-validate
description: Validate one peer review outcome when dispatched a ValidateReview action.
---

# zr-validate

## Job

Perform independent validation for one completed peer review.

## Inputs

- dispatched action payload with `kind: ValidateReview`
- routed review/task/PR context

## Validation Requirements

**For the routed review, verify all three:**

1. **Reviewer independence**
   - Reviewer is not the task owner/PR author
   - Validation is by a different agent than the reviewer

2. **Outcome is grounded in evidence**
   - Review all review comments
   - Check for "Critical" severity issues
   - Ensure no "Request changes" with critical/blocking issues

3. **Summary is substantive**
   - Not just "LGTM" rubber-stamps
   - Reviews should reference task requirements
   - At least some code quality feedback (even if minor)

## Validation Checklist

```
PR: [URL]
Task: #[ID]
Review: #[REVIEW_ID]

Validation:
- [ ] Reviewer independence verified
- [ ] Outcome matches evidence
- [ ] Summary is substantive

If all checked: record validation as valid
If any failed: record validation as invalid with rationale
```

## Steps

1. Load routed review/task/PR context.
2. Inspect review summary and supporting PR context.
3. Apply the three validation checks above.
4. Decide `valid` or `invalid`.
5. Leave a GitHub review/comment artifact, then complete via Probe:

```bash
probe action show <action-id> --json
probe task get <task-id>
gh pr view <number> --repo <org.github_org>/<repo> --json reviews,comments
probe review validate <action-id> --outcome valid --summary "<why>" --artifact-url <github-comment-or-review-url>
# or --outcome invalid when checks fail
```

## What This Skill Does NOT Do

- Deep code review
- Task ownership assignment
- Final merge execution

**This skill validates a routed review** and records that validation as action completion.

## Anti-Patterns

- Validating your own review
- Ignoring obvious blocking concerns
- One-line rubber-stamp validation summaries
- Completing validation without checking routed context

## Output Contract

- Routed ValidateReview action is completed with `valid` or `invalid`.
- Validation summary is explicit and audit-friendly.

## Merge-ready dispatch (`MergeReadyTask`)

When routed a merge-ready task action instead of validation:

```bash
probe action show <action-id> --json
probe task get <task-id>
# merge the linked PR or otherwise finalize the task, then:
probe action complete-merge <action-id>
```

Do not call `probe action complete` for merge-ready routes.
