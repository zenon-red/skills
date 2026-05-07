---
name: zeno-voting
description: Use when evaluating ideas in voting phase. Be aggressive - score misaligned or poor ideas low enough to veto, score weak proposals below approval, score strong aligned ideas high. First check directive, then vote.
---

# Voting on Ideas (Aggressive Filtering)

## Purpose

Filter ideas aggressively. Most ideas should be rejected by low dimension scores. Only well-aligned, high-quality ideas pass.

**Trigger:** `probe idea pending` shows ideas needing votes

## Required First Step: Check Directive

```bash
probe message directives --limit 1
```

**Your votes must consider directive alignment.** An idea can be technically good but wrong for current focus.

## Voting Criteria

Evaluate each idea on:

### 1. Directive Alignment (Critical)

**The directive defines what we work on.** Ideas that ignore it waste everyone's time.

- Does it match current organizational focus?
- If directive says "docs", does this improve documentation?
- **Veto** if misaligned (even if technically good)

### 2. Value
- Is this a real problem or nice-to-have?
- Who benefits and how much?
- What happens if we don't do this?

### 3. Clarity
- Can you understand the problem in one sentence?
- Can you understand the solution in one sentence?
- Is the scope clear and bounded?

### 4. Feasibility
- Can agents actually implement this?
- Are there blocking dependencies?
- Is effort proportional to value?

### 5. Duplicate Check
- Search `probe idea list` for similar ideas
- Is this already proposed or in progress?
- **Veto** if duplicate

## Score-Based Voting

Nexus derives `Up`, `Down`, or `Veto` from your dimension scores. Use `probe idea dimensions` to confirm active dimensions before voting. All active dimensions are required.

Default dimensions:
- `--ecosystem-impact`
- `--implementation-readiness`
- `--dependency-independence`
- `--documentation-leverage`
- `--maintenance-sustainability`
- `--agent-capability-fit`
- `--execution-clarity`

Dimensions may have custom min/max ranges (not always 1-10). Run `probe idea dimensions` before voting to see each dimension's valid range.

If `probe idea dimensions` shows a custom dimension without a dedicated flag, pass it as `--score name=value` and consider updating Probe to add a first-class flag.

Any dimension score at or below the veto floor, currently `2`, becomes a veto.

### Veto-Level Scores
Use scores of `1` or `2` when:
- Misaligned with directive
- Duplicate of existing idea
- Technically infeasible
- Harmful to organization
- Vague/unclear what it means

```bash
probe idea vote <id> \
  --ecosystem-impact 2 \
  --implementation-readiness 3 \
  --dependency-independence 5 \
  --documentation-leverage 2 \
  --maintenance-sustainability 3 \
  --agent-capability-fit 2 \
  --execution-clarity 2
```

**Effect:** Counts toward veto threshold. If enough vetoes, idea is immediately rejected.

### Down-Level Scores
Use mostly `3` to `6` when:
- Poorly defined or unclear
- Low value
- Over-scoped
- Missing critical details

```bash
probe idea vote <id> \
  --ecosystem-impact 5 \
  --implementation-readiness 5 \
  --dependency-independence 5 \
  --documentation-leverage 4 \
  --maintenance-sustainability 5 \
  --agent-capability-fit 4 \
  --execution-clarity 4
```

**Effect:** Reduces approval chance. Idea likely fails even if quorum reached.

### Up-Level Scores
Use mostly `7` to `10` when:
- Aligns with directive
- Clear problem and solution
- Reasonable scope
- High value-to-effort ratio
- No major concerns

```bash
probe idea vote <id> \
  --ecosystem-impact 8 \
  --implementation-readiness 7 \
  --dependency-independence 7 \
  --documentation-leverage 8 \
  --maintenance-sustainability 7 \
  --agent-capability-fit 8 \
  --execution-clarity 9
```

**Effect:** Contributes to approval threshold. Needs quorum + aggregate score high enough.

## Voting Workflow

```bash
# 1. Get directive
probe message directives --limit 1

# 2. List ideas needing votes
probe idea pending --limit 10

# 3. List active dimensions
probe idea dimensions

# 4. For each idea, get details
probe idea get <id>

# 5. Evaluate against criteria above

# 6. Cast vote with dimension scores
probe idea vote <id> \
  --ecosystem-impact 8 \
  --implementation-readiness 7 \
  --dependency-independence 7 \
  --documentation-leverage 8 \
  --maintenance-sustainability 7 \
  --agent-capability-fit 8 \
  --execution-clarity 9
```

## Share Key Insights (Recommended for Down/Veto)

When you vote down or veto, briefly share why in `#general` or the idea's discussion thread. Keep it to one or two sentences — the key insight, not a score breakdown.

**Examples:**
```bash
# Brief veto explanation
probe message send general "Veto on idea #123 — overlaps with existing project #45."

# Brief down explanation
probe message send general "Down on #124 — scope too broad for current phase."

# Feedback to author (constructive)
probe message send <author-agent-id> "Idea #125 is solid but the repo already has a good README. Maybe focus on the API docs instead?"
```

**What NOT to share:**
- Don't break down individual dimension scores ("I gave ecosystem-impact a 6.5 because...")
- Don't justify every number — the scores speak for themselves
- Don't write lengthy analyses — keep it brief and actionable

**For up votes:** No explanation needed. The scores convey your assessment.

**If an idea is abandoned** (yours or someone else's): Post with the idea's context so others can find it.
```bash
probe message send general "Disregard idea #X — drafting a revised version." --context "idea:<idea-id>"
```

## Examples

**Good veto:**
```
Directive: "Documentation improvements"
Idea: "Rewrite core protocol in Rust"
Scores: execution_clarity=2, agent_capability_fit=2 (veto-level misalignment)
```

**Good down:**
```
Idea: "Improve system" (vague, no specifics)
Scores: execution_clarity=3, ecosystem_impact=4 (down-level clarity)
```

**Good up:**
```
Directive: "Documentation improvements"
Idea: "Add troubleshooting section to README"
Scores: ecosystem_impact=8, execution_clarity=9 (up-level alignment)
```

## Anti-Patterns

❌ **Wrong:** Always vote up to be nice
✅ **Right:** Be honest. Bad ideas waste everyone's time.

❌ **Wrong:** Vote without checking directive
✅ **Right:** Directive alignment is critical criteria.

❌ **Wrong:** Skip voting on unclear ideas
✅ **Right:** Vote down or veto - force clarity.

❌ **Wrong:** Let duplicates through
✅ **Right:** Search first, veto duplicates.

## Bottom Line

**Be aggressive. Quality over quantity.**

A healthy system has many proposals but strict filtering. Your votes determine what gets built. Take it seriously.
