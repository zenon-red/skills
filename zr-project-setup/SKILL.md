---
name: zr-project-setup
description: Convert one approved idea into an executable project when probe next routes project_setup.
---

# zr-project-setup

## Job

Create a project record from one approved idea and set it up for task decomposition.

## Inputs

- `probe next` output with `kind: project_setup`
- routed approved idea ID

## Steps

1. Read the approved idea and directive context.
2. Create project with clear objective and scope.
3. Set initial project status for task creation.
4. Announce project creation with ID and intent.

## Commands

```bash
probe idea get <idea-id>
probe project create --idea-id <idea-id> --title "<project-title>" --description "<scope>"
probe project update <project-id> --status ready_for_tasks
probe message send general "Project <project-id> created from idea <idea-id>."
```

## Output Contract

- One project created and linked to the approved idea.
- Project is in a status that enables task generation.
