---
name: zeno-validating-work
description: Use when about to submit work, before committing or pushing, to run verification commands and confirm the work actually passes before claiming completion
---

# Validating Work (Contributor Workflow)

## Overview

Run verification commands and confirm actual results before claiming work is complete or submitting. Evidence before assertions.

**Trigger:** About to commit, push, or claim task complete

**Action:** Run tests/verification → Confirm output → Then submit

## The Gate Function

```
BEFORE claiming completion or submitting:

1. IDENTIFY: What proves this task is done?
   - Tests? Which command?
   - Linter? Which command?
   - Manual verification? What to check?

2. RUN: Execute the FULL command fresh
   - Don't trust previous runs
   - Run it now in this session

3. READ: Full output, check exit code, count failures

4. VERIFY: Does output confirm success?
   - YES: State completion WITH evidence
   - NO: Fix issues, re-run, or report actual status

5. ONLY THEN: Commit, push, or claim complete

Skip any step = unverified claim
```

## Verification Commands by Component

**stdb (Rust):**
```bash
cd stdb && cargo test && cargo clippy -- -D warnings
# Expected: All tests pass, no warnings
```

**backend (Deno):**
```bash
cd backend && deno task test && deno task lint
# Expected: All tests pass, no lint errors
```

**frontend (Node):**
```bash
cd frontend && npm run lint:all && npm run typecheck
# Expected: No lint errors, no type errors
```

**docs:**
```bash
# Manual verification: Links work, formatting correct
```

## Common Verification Needs

| Task Type | Verify | Command Example |
|-----------|--------|-----------------|
| Feature | Tests pass | `cargo test feature_name` |
| Bug fix | Regression test + original symptom fixed | Run reproduction steps |
| Refactor | No behavioral changes | Full test suite |
| Docs | Links/formatting | Manual check or link checker |

## Anti-Patterns

❌ **Wrong:** "Should work now" without running tests
✅ **Right:** `[Run tests] [See: 12/12 pass] "Tests pass, ready to submit"`

❌ **Wrong:** "Linter passed" for compile check
✅ **Right:** Separate verification: `cargo check` then `cargo clippy`

❌ **Wrong:** Claiming completion while tests failing
✅ **Right:** Report actual status: "3 tests failing, need to fix X"

❌ **Wrong:** Trusting a previous test run
✅ **Right:** Fresh verification in current session

## Red Flags - STOP

- About to push without running verification
- Using "should", "probably", "seems" before verification
- Expressing satisfaction before checking: "Done!" (without verifying)
- Thinking "just this once" skip verification

## Integration

**Before:** `executing-tasks` (completing the work)
**After:** `submitting-work` (push and create PR)

## Bottom Line

**Run verification. Read output. Then claim completion.**

No shortcuts. No assumptions. Evidence first.
