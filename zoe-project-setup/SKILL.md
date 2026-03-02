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

## Phase 5: Update Project Status

**Mark as ready for tasks:**
```bash
probe project update <project-id> --status ready_for_tasks
```

---

## Summary

**Project setup flow:**
1. Verify idea approved
2. Create Nexus project
3. Create repository
4. Write and commit PLAN.md
5. Mark ready for tasks

**Next:** Task creation cron will pick up projects with `ready_for_tasks` status

**Assets:**
- [Project Plan Template](assets/project-plan-template.md) - Use for PLAN.md
- [Naming Guide](references/naming-guide.md) - Repository naming rules
