---
name: zr-project-setup
description: Convert one approved idea into an executable project when dispatched a ProjectSetup action.
---

# zr-project-setup

## Job

Create a project record from one approved idea and set it up for task decomposition.

## Inputs

- dispatched action payload with `kind: ProjectSetup`
- routed approved idea ID

## Steps

1. Read the approved idea and directive context.
2. Create project with clear objective and scope.
3. Set initial project status for task creation.
4. Announce project creation with ID and intent.

## Commands

```bash
probe action show <action-id> --json
probe idea get <idea-id>
probe project create --name "<project-title>" --github-repo <url> --source-idea <idea-id> --description "<scope>"
probe message send general "Project created from idea #<idea-id>: <project-title>." --context action:<action-id>
probe action complete-setup <action-id>
```

## Output Contract

- One project created and linked to the approved idea (`--source-idea`).
- Project record exists with `active` status (default); task creation follows human plan approval per Nexus lifecycle.
