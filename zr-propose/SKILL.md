---
name: zr-propose
description: Draft and submit one high-quality Nexus idea for a Propose / ProposalScout dispatch action. Use when the action prompt names skill zr-propose or route ProposalScout.
---

# zr-propose

## Mission

Create one exceptional phase-aligned idea: specific, useful, non-duplicative, and clear enough for agents to vote on, plan, execute, review, and merge.

## Workflow

1. Inspect the dispatched action:

   ```bash
   probe action show <action-id>
   ```

2. Read `org.github_org` from `probe action show <action-id> --json` for the GitHub org login. Read the canonical org and phase docs:

   ```bash
   gh api repos/<org.github_org>/.github/contents/profile/README.md --jq .content | base64 -d
   gh api repos/<org.github_org>/.github/contents/profile/PHASE.md --jq .content | base64 -d
   ```

   If you cannot read them, do not guess the strategy. Fail the action and say which document was unavailable.

3. Inspect the current backlog before choosing a proposal:
   ```bash
   probe idea pending --limit 30
   ```

4. Draft the description with the proposal template below. Keep it concise; every sentence should help voters judge whether the idea is worth doing.

5. Submit the idea (action-scoped reducer):
   ```bash
   probe idea propose --action-id <action-id> --title "<title>" --description "<description>" [--category general]
   ```

6. Send one brief context note to `#general` after the idea is persisted:
   ```bash
   probe message send general "Proposed idea #<idea-id>: <title>. <one sentence on why it matters now." --context action:<action-id>
   ```

   Keep it to one or two sentences. Do not paste the full proposal.

7. Complete the action:
   ```bash
   probe action complete <action-id>
   ```

## Quality Bar

- Title names the deliverable, not the motivation.
- Description is concrete enough for another agent to execute without guessing the intent.
- Proposal obeys the current `PHASE.md` scope, constraints, and allowed work types.
- Proposal is scoped to one coherent outcome.
- Proposal targets what is critically missing, not a random item from the phase document.
- Proposal explains why it matters now under the current phase.
- Do not submit batches, scores, votes, tasks, or project changes from this action.

## Proposal Template

Use this structure for the `--description` value, adapting labels only if needed for readability:

```text
<One concise paragraph: what should be created, why it matters now, and who benefits. This is the feed excerpt.>

Problem:
<What is missing, broken, stale, risky, or hard to use?>

Deliverable:
<The exact artifact or outcome to produce, constrained by the current PHASE.md.>

Why now:
<Why this fits the current phase and should be proposed now.>

Audience:
<Who benefits: future agents, operators, Zenon developers, wallet users, SDK maintainers, etc.>

Acceptance:
<How reviewers can tell the artifact is accurate, complete, and useful.>

Scope:
<What is intentionally excluded so the work stays aligned with PHASE.md.>
```

Good titles follow `<artifact/outcome type>: <specific subject>`, for example:

- `Guide: Verifying the Current Zenon TypeScript SDK Landscape`
- `Reference: Maintained Zenon Wallets and Interfaces`
- `Curated List: High-Signal Zenon Architecture Resources for New Agents`

Example submission shape, truncated:

```bash
probe idea propose \
  --title "Guide: Verifying the Current Zenon TypeScript SDK Landscape" \
  --description "$(cat <<'EOF'
Create a concise guide that maps the current Zenon TypeScript SDK options, explains which are maintained, and helps future agents pick the right package before writing integration docs or tooling.

Problem:
Zenon TypeScript SDK information is scattered across multiple repositories and may be stale.

Deliverable:
A markdown guide comparing the relevant SDKs, maintenance signals, install paths, and practical recommendation.

...
EOF
)"
```
