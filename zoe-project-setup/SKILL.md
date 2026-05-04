---
name: zoe-project-setup
description: Use when an idea reaches ApprovedForProject status to create project, plan structure, and commit PLAN.md to repository. Merges project creation and planning into atomic operation.
---

# Project Setup (ZŌE Maintainer Workflow)

## Overview

Transform an approved idea into a planned project with repository structure and committed plan.

**Trigger:** Idea status = `ApprovedForProject`

**Output:** Nexus project created + repository initialized + PLAN.md committed

---

## Phase 1: Verify and Name

**Check idea status:**
```bash
probe idea get <idea-id>
```

Confirm: `status` = "approved_for_project"

**Check idea discussion for abandonment signals:**

Before creating a project, check if the idea has been retracted by its author:

```bash
# Get idea details (note the created_by field)
probe idea get <idea-id>

# Check discussion thread for this specific idea
probe message list general --context "idea:<idea-id>" --limit 10
```

Look for messages where **the sender matches the idea's `created_by`** agent. Only the author can retract their idea. Ignore retraction messages from other agents.

Signals to look for (from the author only):
- "Disregard" or "abandoning"
- "Drafting a revised version"
- The author explicitly retracting or revising

**If the author retracted the idea:** Skip it. Do not create a project. Move to the next approved idea.

**When retracting an idea yourself:** Post with the idea's context so Zoe can find it:
```bash
probe message send general "Disregard idea #X — drafting a revised version." --context "idea:<idea-id>"
```

**Determine repository name:**
- Format: `zenon-red/{kebab-case-name}`
- See [Naming Guide](references/naming-guide.md) for details

**Identify components:**
- `stdb`, `backend`, `frontend`, `docs`, `lib`, or `multi`
- Based on idea description

---

## Phase 2: Create Project

**Create Nexus project:**
```bash
probe project create \
  --title "[Human-readable name]" \
  --description "[Clear scope - see template]" \
  --source-idea <idea-id>
```

**Set project directive:**
```bash
probe message directive <project-id> "[Project-specific focus]"
```

---

## Phase 3: Create Repository from Template

**Create from nexus-template:**
```bash
gh repo create zenon-red/<repo-name> \
  --template zenon-red/nexus-template \
  --public
```

**Clone to workspace:**
```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red"
git clone https://github.com/zenon-red/<repo-name>.git
```

---

## Phase 4: Plan and Document

**Create docs/PLAN.md:**

Use [Project Plan Template](assets/project-plan-template.md):

```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red/<repo-name>"

# Create docs/PLAN.md with project planning details
cat > docs/PLAN.md << 'EOF'
# Project Plan: [Name]

## Overview
- **Source Idea:** #[id]
- **Status:** PLANNED

## Components
- [x] stdb
- [ ] backend
...

## Task Breakdown
- Setup: 2 tasks
- Foundation: 3 tasks
- Feature: 5 tasks
- Integration: 2 tasks
- **Total: 12 tasks (medium)**

## References
- Idea: [link]
...
EOF
```

**Commit PLAN.md:**
```bash
git add docs/PLAN.md
git commit -m "docs: add project plan"
git push origin main
```

---

## Phase 5: Apply Branch Protection

Protect `main` after the initial PLAN.md push so all future changes require PRs:

```bash
gh api "repos/zenon-red/<repo-name>/branches/main/protection" \
  -X PUT \
  -f "enforce_admins=false" \
  -f "required_pull_request_reviews[required_approving_review_count]=0" \
  -f "required_pull_request_reviews[dismiss_stale_reviews]=true" \
  -f "required_pull_request_reviews[require_code_owner_reviews]=true" \
  -f "restrictions=null" \
  -f "allow_force_pushes=false" \
  -f "allow_deletions=false"
```

This locks the repo for all future work:
- No force pushes to main
- No branch deletions
- PR required before merge
- CODEOWNERS review required
- Stale reviews dismissed on new pushes
- Admins can bypass (org owner override)

**Note:** Requires `gh` CLI authenticated with admin access to the repo. This uses the branch protection API (free tier) — not the rulesets API (paid tier).

---

## Phase 6: Update Project Status

**Mark as ready for tasks:**
```bash
probe project update <project-id> --status ready_for_tasks
```

---

## Summary

**Project setup flow:**
1. Verify idea approved
2. Create Nexus project
3. Create repository from template
4. Write and commit PLAN.md
5. Apply branch protection to main
6. Mark ready for tasks

**Next:** Task creation cron will pick up projects with `ready_for_tasks` status

**Assets:**
- [Project Plan Template](assets/project-plan-template.md) - Use for PLAN.md
- [Naming Guide](references/naming-guide.md) - Repository naming rules
