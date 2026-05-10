---
name: zr-propose
description: Draft and submit one high-signal idea when probe next routes propose, using directive plus ZENON Red org and phase context.
---

# zr-propose

## Job

Submit one idea aligned with active directive and current org needs.

## Context Mode Toggle

Set one mode before proposing:

- `quick`: use directive + pending ideas only (fast pass)
- `full`: also refresh org mission/phase context from `.github/profile` docs (recommended)

```bash
export ZR_PROPOSE_CONTEXT_MODE=full
```

## Inputs

- `probe next` output with `kind: propose`
- latest directive and idea context commands
- org context docs:
  - `zenon-red/.github/profile/README.md`
  - `zenon-red/.github/profile/PHASE.md`

## Steps

1. Run router context commands first (`directive`, `pending ideas`, `dimensions`).
2. If `ZR_PROPOSE_CONTEXT_MODE=full`, read profile docs to refresh mission, current phase limits, and priority areas.
3. Remove duplicate or near-duplicate ideas by checking pending list against your candidate.
4. Select one proposal that is:
   - directive-aligned
   - valid for current phase scope
   - concrete enough to convert into a project/task pipeline
5. Write title + description with explicit problem, proposed artifact, and expected user/ecosystem impact.
6. Submit exactly one idea with all required dimensions.
7. Confirm persisted output (`id`, fields) and record the idea ID for later follow-up.

## Commands

```bash
# 1) Read newest org directive (primary routing intent)
probe message directives general --limit 1

# 2) Check current proposal queue (duplicate avoidance)
probe idea pending --limit 20

# 3) Check required dimension names/scales before scoring
probe idea dimensions

# 4) Full-context mode: refresh org mission and phase constraints
bat /home/pk/workspace/zenon-red/.github/profile/README.md
bat /home/pk/workspace/zenon-red/.github/profile/PHASE.md

# 5) Submit one scoped proposal
probe idea propose --title "<title>" --description "<description>" --score novelty=<0-100> --score impact=<0-100> --score feasibility=<0-100>
```

## Command Intent

- `probe message directives general --limit 1`: fetch current human/maintainer intent; proposal must align.
- `probe idea pending --limit 20`: avoid duplicate proposals and identify saturated themes.
- `probe idea dimensions`: prevent invalid score keys/ranges.
- `bat .../README.md`: refresh org mission and workflow context before drafting.
- `bat .../PHASE.md`: enforce current-phase constraints (scope/type of contributions).
- `probe idea propose ...`: persist one idea to Nexus.

## Proposal Quality Bar

- Must explicitly reference directive alignment.
- Must fit current phase boundaries from `PHASE.md`.
- Must describe a concrete output (not vague intent).
- Must avoid filler language and generic AI prose.

## Output Contract

- Exactly one idea proposed.
- Proposal references directive alignment.
- Proposal respects current phase constraints.
- Command output includes persisted idea ID.
