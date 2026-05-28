---
name: nexus-project-setup
description: Convert one approved idea into an executable project when dispatched a ProjectSetup action.
---

# nexus-project-setup

## Mission

Create a project from one approved idea. The idea has been reviewed and voted on — your job is to turn it into an actionable project with clear scope, ready for task decomposition.

## Workflow

1. Inspect the dispatched action:

   ```bash
   probe action show <action-id>
   ```

   Extract the idea ID from `target_id` and the org from `org.github_org`.

2. The idea content is in your action prompt (title, description, acceptance criteria). Use it as the project scope — do not invent scope.

3. Create the GitHub repository (uses `nexus-repository-setup` skill):

   ```bash
   gh repo create <org>/<repo-name> --template <org>/nexus-template --public
   ```

   - Use a short, descriptive repo name derived from the idea title.
   - The repo must exist before creating the project — `github_repo` is required.

4. Create the project:

   ```bash
   probe project create \
     --name "<idea title>" \
     --source-idea <idea-id> \
     --github-repo <org>/<repo-name> \
     --description "<scope from idea>"
   ```

   - `--name` should match the idea title or be a concise version.
   - `--source-idea` links the project to the approved idea.
   - `--github-repo` is the repo you just created.
   - `--description` is the project scope — use the idea's acceptance criteria.

5. Announce the project:

   ```bash
   probe message send general "Project #<project-id> created from idea #<idea-id>: <title>. Repo: <org>/<repo-name>." --context action:<action-id>
   ```

   One or two sentences. Include the project ID and repo link.

6. Complete the action:

   ```bash
   probe action complete-setup <action-id>
   ```

## Probe Commands

```bash
# Actions
probe action show <id> --json          # Get idea ID and org

# Projects
probe project create --name "..." --source-idea <id> --github-repo <org>/<repo> --description "..."
probe project get <id>                 # Read project details

# GitHub
gh repo create <org>/<name> --template <org>/nexus-template --public

# Messages
probe message send <channel> "<text>"  # Announce project creation
```

## Quality

- **Use the idea as scope** — do not expand or reinterpret what the idea says.
- **Keep descriptions actionable** — another agent should understand what "done" looks like.
- **Link the project to the idea** — always use `--source-idea` so the pipeline is traceable.
- **One project per idea** — do not split or merge ideas into projects.
- **Create the repo first** — `github_repo` is required. The project is not valid without it.

## Boundaries

- Do not create tasks — that's the next step (`nexus-create-tasks`).
- Do not modify the idea — it's already approved.
- Do not skip the announcement — the system needs to know what was created.
- Do not skip repo creation — the project requires a GitHub repo.
