---
name: nexus-create-tasks
description: Break one active project into independent, ready-to-execute tasks when dispatched a CreateTasks action.
---

# nexus-create-tasks

## Mission

Decompose one approved project into a set of independent tasks. The project has a clear scope — your job is to break it into executable pieces that agents can claim and deliver.

## Workflow

1. Inspect the dispatched action:

   ```bash
   probe action show <action-id>
   ```

   Extract the project ID from `target_id`.

2. Read the project and spec:

   ```bash
   probe project get <project-id>
   probe project spec show <project-id>
   ```

   The project name, description, and linked idea define the scope. Parse `### Requirement:` headers from the gating spec file in git. Do not expand beyond what the spec says.

3. Design 3–8 tasks:
   - Each task should be independently deliverable.
   - Each task should have clear acceptance criteria.
   - Add dependencies only when strictly necessary.
   - Keep tasks small enough for a single execution cycle.

4. Create the tasks:

   ```bash
   probe task create --project <project-id> --title "<title>" --description "<acceptance-criteria>" --spec-requirement "<requirement-name>"
   ```

   Repeat for each task. Set `--spec-requirement` to the exact `### Requirement:` name each task implements.

5. Verify the ready queue:

   ```bash
   probe task ready --limit 20
   ```

   All created tasks should appear in the ready queue (no unmet dependencies).

6. Announce the task set:

   ```bash
   probe message send general "Created task set for project #<project-id>: <task titles>. Ready for claiming." --context action:<action-id>
   ```

   Include the project ID and a brief summary of the tasks created.

7. Complete the action:

   ```bash
   probe action complete-tasks <action-id>
   ```

## Probe Commands

```bash
# Actions
probe action show <id>                   # See action details (target_id, etc.)

# Projects
probe project get <id>                   # Read project scope and linked idea
probe project spec show <id>             # Spec path, review status, approved bindings

# Tasks
probe task create --project <id> --title "..." --description "..." --spec-requirement "..."
probe task ready --limit 20              # Verify ready queue
probe task list --project <id>           # See all tasks for a project

# Messages
probe message send <channel> "<text>"    # Send a message

# Output
probe <command> --json                   # JSON output for piping to jq
```

## Quality

- **Stay within project scope** — do not add tasks that aren't in the project description.
- **Make tasks independent** — each task should be deliverable without waiting for others, unless there's a hard dependency.
- **Write acceptance criteria** — each task needs clear "done" conditions. Vague tasks lead to vague deliverables.
- **Keep tasks small** — one task = one execution cycle. If a task is too big, split it.

## Boundaries

- Do not claim tasks — that's for executing agents.
- Do not modify the project — it's already approved.
- Do not skip the announcement — the system needs to know what was created.
- Do not create more than 8 tasks — if the project needs more, it's too big. Split the project first.
