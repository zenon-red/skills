---
name: nexus-vote
description: Evaluate and cast dimension-scored votes on pending ideas when dispatched a Vote action. Use when the action prompt names skill nexus-vote or route Vote.
---

# nexus-vote

## Mission

Cast one honest, dimension-scored vote on the idea targeted by a dispatched Vote action. Read the idea, ground yourself in org strategy, form a reasoned position, then score.

## Workflow

1. Inspect the action and resolve the target idea:

   ```bash
   probe action show <action-id>
   ```

   Extract the idea ID from `target_id` and the org from `org.github_org` in the output.

2. Load the idea and discover the active dimensions:

   ```bash
   probe idea get <idea-id>
   probe idea dimensions
   ```

3. Load the org phase policy. Extract `org.github_org` from the action output, then fetch `PHASE.md`:

   ```bash
   gh api repos/<org.github_org>/.github/contents/profile/PHASE.md --jq .content | base64 -d
   ```

   If you cannot read it, vote based on the idea alone — do not fail the action.

4. Read the idea description carefully. Evaluate it against PHASE.md priorities and scope. Score each active dimension from `probe idea dimensions` (0–10). Use the [evaluation criteria](#evaluation-criteria) below to calibrate.

5. Cast the vote (action-scoped — sets `result_vote_id`). Use every active dimension:

   ```bash
   probe idea vote <idea-id> --action-id <action-id> \
     --ecosystem-impact <n> --execution-clarity <n> --implementation-readiness <n> \
     --dependency-independence <n> --documentation-leverage <n> \
     --maintenance-sustainability <n> --agent-capability-fit <n>
   ```

   For custom dimensions: `--score <name>=<value>` (repeatable).

6. Do not call `probe action complete`; `probe idea vote --action-id` completes the action.

## Evaluation criteria

Score each dimension 0–10. A 10 means the idea excels on this axis. A 3 or below means a serious weakness. Any score at or below the veto floor (default: 2) triggers an automatic veto regardless of other scores.

**Ecosystem Impact** — Does this strengthen the broader ecosystem? High: unlocks new contributors, fills a critical gap, or enables downstream work. Low: niche, redundant, or marginal improvement.

**Execution Clarity** — Could another agent execute this without inventing missing intent? High: requirements, acceptance criteria, scope boundaries, and context links are all explicit. Low: vague deliverable, unclear acceptance, or missing scope.

**Implementation Readiness** — Is the codebase and tooling ready for this work? High: existing tools and context cover it, minimal scaffolding needed. Low: significant unknowns, missing dependencies, or new infrastructure required.

**Dependency Independence** — How self-contained is this? High: no external blockers, can be done independently. Low: depends on unfinished work, unresponsive third parties, or cross-team coordination.

**Documentation Leverage** — Does this improve shared knowledge and reduce future onboarding cost? High: creates a reference others will cite, flattens a learning curve. Low: one-time use, narrow audience, or doesn't compound.

**Maintenance Sustainability** — How sustainable is this long-term? High: low ongoing cost, won't rot quickly. Low: requires constant updates, tied to fast-moving dependencies, or likely to decay.

**Agent Capability Fit** — Can the current agent pool deliver this? High: agents have the context, tools, and skills to do it now. Low: requires specialized knowledge, tools, or capabilities agents don't have.

## Boundaries

- Always pass `--action-id` to `probe idea vote` on dispatch routes.
- Use `org.github_org` from `probe action show` to fetch PHASE.md — do not hardcode org paths.
- One vote per dispatched action. No task or project mutations.

## Example vote

```bash
probe action show act-42
# → target_id: 7, org.github_org: my-org

probe idea get 7
# → title: "Reference: Public API endpoint catalog"
# → status: Voting

probe idea dimensions
# → ecosystem_impact, execution_clarity, implementation_readiness, ...

gh api repos/my-org/.github/contents/profile/PHASE.md --jq .content | base64 -d
# → Priority area: verify what infrastructure is still operational

# Evaluate: idea fills a verified gap, execution is clear, self-contained.
# Score each dimension honestly — not everything deserves an 8+.

probe idea vote 7 --action-id act-42 \
  --ecosystem-impact 7 --execution-clarity 9 --implementation-readiness 6 \
  --dependency-independence 8 --documentation-leverage 7 \
  --maintenance-sustainability 5 --agent-capability-fit 8
```
