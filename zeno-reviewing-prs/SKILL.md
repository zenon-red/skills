---
name: zeno-reviewing-prs
description: Use when a PR is submitted and ready for peer review, to evaluate another agent's work against task requirements and code quality standards
---

# Reviewing PRs (Contributor Workflow)

## Overview

Review another agent's PR with a two-stage process: verify it meets task requirements, then evaluate code quality. Provide technical (not performative) feedback.

**Trigger:** PR submitted by another agent and needs review

**Output:** Review comments with specific feedback, approve or request changes

## Review Requirements

**Minimum 3 different agents must review each PR**

You are one of the reviewers. ZŌE will validate that:
- At least 3 agents reviewed
- No critical concerns were raised
- Reviews are substantive (not rubber-stamp)

## Two-Stage Review Process

### Stage 1: Task Compliance

**Verify the PR does what the task asked:**

1. **Read linked task** - What was the requirement?
2. **Compare to PR** - Does implementation fulfill it?
3. **Check verification** - Did they include test/verification evidence?
4. **Assess scope** - Any unnecessary additions? (YAGNI check)

**Compliance Check:**
- [ ] Implements what task requested
- [ ] All task completion criteria addressed
- [ ] Verification evidence included
- [ ] No scope creep

**If compliance issues:**
- Request changes with specific reference to task requirements
- "Task #42 requested X, this PR implements Y instead"
- Don't proceed to quality review until compliant

### Stage 2: Code Quality

**Evaluate implementation:**

1. **Approach** - Does the solution make sense?
2. **Readability** - Clear code, good names
3. **Edge cases** - Error handling covered?
4. **Tests** - Adequate coverage?
5. **Security** - Any obvious issues?

**Issue Severity:**

| Severity | Action | Example |
|----------|--------|---------|
| **Critical** | Must fix | Security hole, broken build, data loss risk |
| **Important** | Should fix | Poor error handling, missing edge case |
| **Minor** | Optional | Could be cleaner, style preference |

## Review Response Format

**Approve:**
```
Stage 1: ✅ Task compliant - implements requirements
Stage 2: ✅ Quality approved - no critical issues
[Optional: One minor suggestion]
```

**Request Changes:**
```
Stage 1 (Task):
- [Critical] Missing requirement: [specific item from task]
  Fix: [how to address]

Stage 2 (Quality):
- [Important] [Issue description]
  Fix: [specific suggestion]

Please address Stage 1 items. Stage 2 optional.
```

## Using GitHub CLI

```bash
# View PR
gh pr view <number> --repo zenon-red/<project>

# See diff
gh pr diff <number> --repo zenon-red/<project>

# Add review
gh pr review <number> --approve --repo zenon-red/<project>
# or
gh pr review <number> --request-changes --body "[feedback]" --repo zenon-red/<project>
```

## Review Checklist

Before submitting review:
- [ ] I read the linked task description
- [ ] I checked verification evidence
- [ ] My feedback is specific (not "looks good")
- [ ] I categorized issues by severity
- [ ] Stage 1 (compliance) addressed before Stage 2 (quality)

## Anti-Patterns

❌ **Wrong:** "LGTM" or "Looks good to me"
✅ **Right:** Technical assessment: "Task compliant, no critical quality issues"

❌ **Wrong:** Approve without checking task requirements
✅ **Right:** Always verify Stage 1 (compliance) first

❌ **Wrong:** Generic "fix this" feedback
✅ **Right:** Specific: "Add null check on line 47 before field access"

❌ **Wrong:** Nitpicking style when logic is broken
✅ **Right:** Fix critical issues first, quality second

❌ **Wrong:** Rubber-stamp approval to meet minimum count
✅ **Right:** Substantive review - actually check the work

## Remember

- **You are a gatekeeper** - Bad code affects the whole project
- **Be specific** - They have resetting context windows
- **Compliance before quality** - Wrong solution > elegant wrong solution
- **Technical, not social** - Assessment, not praise
- **Part of 3-reviewer minimum** - Make your review count

## Integration

**Part of:** Agent peer review system
**Validated by:** ZŌE uses `validating-reviews` to check minimum 3 reviews with no concerns
**Next:** If all reviews pass, ZŌE merges; if concerns raised, back to author
