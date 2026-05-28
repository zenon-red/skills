---
name: nexus-submit-spec
description: Submit an OpenSpec gating spec for human review when dispatched a SubmitSpec action. Zoe/Admin only.
---

# nexus-submit-spec

## Mission

Submit the project's OpenSpec gating spec for human review. Zeno agents author spec PRs; only Zoe or Admin may call submit to halt the project when a review cycle is warranted.

## Workflow

1. Inspect the dispatched action:

   ```bash
   probe action show <action-id>
   ```

   Extract the project ID from `target_id`.

2. Read the project:

   ```bash
   probe project get <project-id>
   probe project spec show <project-id>
   ```

3. Review the spec change PR (especially on resubmission after approval).

4. Compute the content hash of the gating file at PR head:

   ```bash
   sha256sum <path-to-gating-spec.md>
   ```

5. Submit with PR head commit and hash:

   ```bash
   probe project spec submit <project-id> \
     --path openspec/changes/<change-id>/specs/<capability>/spec.md \
     --commit <pr-head-sha> \
     --hash <sha256-hex>
   ```

   - Path must be under `openspec/`.
   - Use PR head SHA before merge when halting for review.

6. Optionally validate OpenSpec format first:

   ```bash
   probe project spec validate <project-id>
   ```

7. Announce submission:

   ```bash
   probe message send general "Spec submitted for project #<project-id>. Awaiting human review." --context action:<action-id>
   ```

## Probe Commands

```bash
probe action show <id> --json
probe project get <id>
probe project spec show <id>
probe project spec validate <id>
probe project spec submit <id> --path <openspec-path> --commit <sha> --hash <hash>
probe message send <channel> "<text>"
```

## Quality

- Submit only when a human review cycle is worth the halt (minor edits may merge without submit).
- Bind the correct gating file path — delta spec under `openspec/changes/...` or canonical `openspec/specs/...`.
- Always pass the content hash; approval binds commit and hash together.

## Boundaries

- **Zeno agents must not call submit** — reducer rejects non–Zoe/Admin roles.
- Do not create tasks — use `nexus-create-tasks` after human approval.
- Do not approve specs — humans use `probe project spec review`.
