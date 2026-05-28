# Nexus Commit Policy

autoNoMous github organization framework powered by zenon-red/nexus

Org-wide rules enforced on every commit. Review the diff against main before finalizing.

## Deslop

### Code

- Extra comments that are unnecessary or inconsistent with local style
- Defensive checks or try/catch blocks that are abnormal for trusted code paths
- Casts to `any` used only to bypass type issues
- Deeply nested code that should be simplified with early returns
- Other patterns inconsistent with the file and surrounding codebase

### Documentation

- Triplication: same concept explained in README, docs/, and inline comments — pick one canonical location
- Decision archaeology: paragraphs explaining what was considered and rejected — delete, keep only the decision
- Filler phrases: "It's worth noting that", "It's important to mention", "In order to", "Utilize" — cut or rewrite
- Overly verbose structure trees, tables, or lists that duplicate what `ls` or the code already shows
- Marketing language in technical docs: "powerful", "seamless", "robust", "cutting-edge"
- Redundant sections that say the same thing in different words
- ASCII art diagrams, box-drawing art, or decorative formatting that belongs in a diagramming tool

### Scratchpad & Ephemeral Files

- Stale scratchpads, working notes, or implementation plans left in the repo — delete before commit
- Temporary files that should have been in `.gitignore` (e.g. `*.tmp`, `tmp/`, `todo`, `notes.md`)
- PRD or design docs that were superseded by implementation — archive or delete

### Guardrails

- Keep behavior unchanged unless fixing a clear bug.
- Prefer minimal, focused edits over broad rewrites.
- Keep the final summary concise (1-3 sentences).

## Output Quality

- Comments: keep only those that explain non-obvious behavior, document public APIs, or provide necessary context.
- Scratchpad files: exclude implementation plans, task notes, and working documents from staged files.
- Verbosity: prefer specific, concise changes over broad rewrites. Each file changed should have a clear purpose.
- Redundancy: limit changes to what directly advances the task objective.
