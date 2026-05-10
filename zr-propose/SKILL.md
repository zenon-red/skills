---
name: zr-propose
description: Draft and submit one high-signal idea when probe next routes propose, using directive plus ZENON Red org and phase context.
---

# zr-propose

## Job

Submit one idea aligned with active directive and current org needs.

## Inputs

- `probe next` output with `kind: propose`
- latest directive and idea context commands

## Steps

1. Fetch the current directive: `probe message directives general --limit 1`
2. Check the pending idea queue for duplicates: `probe idea pending --limit 20`
3. Look up required dimension names and score ranges: `probe idea dimensions`
4. Read org profile docs to refresh mission, current phase limits, and priority areas: `gh api repos/zenon-red/.github/contents/profile/README.md --jq .content | base64 -d` and `gh api repos/zenon-red/.github/contents/profile/PHASE.md --jq .content | base64 -d`
5. Remove duplicate or near-duplicate ideas by checking pending list against your candidate.
6. Select one proposal that is:
   - directive-aligned
   - valid for current phase scope
   - concrete enough to convert into a project/task pipeline
7. Write title + description with explicit problem, proposed artifact, and expected user/ecosystem impact.
8. Submit exactly one idea with all required dimensions: `probe idea propose --title "<title>" --description "<description>" --score novelty=<0-100> --score impact=<0-100> --score feasibility=<0-100>`
9. Confirm persisted output (`id`, fields) and record the idea ID for later follow-up.

## Commands

```bash
probe message directives general --limit 1
probe idea pending --limit 20
probe idea dimensions
gh api repos/zenon-red/.github/contents/profile/README.md --jq .content | base64 -d
gh api repos/zenon-red/.github/contents/profile/PHASE.md --jq .content | base64 -d
probe idea propose --title "<title>" --description "<description>" --score novelty=<0-100> --score impact=<0-100> --score feasibility=<0-100>
```

## Proposal Quality Bar

- Must explicitly reference directive alignment.
- Must fit current phase boundaries from `PHASE.md`.
- Must describe a concrete output (not vague intent).
- Title must name the specific deliverable (not "Improve X" — "Write Y").
- Description must state: what exists now, what will be produced, who uses it.

## Output Contract

- Exactly one idea proposed.
- Proposal references directive alignment.
- Proposal respects current phase constraints.
- Command output includes persisted idea ID.
