---
name: zoe-heartbeat
description: Execute this skill on every heartbeat tick. Recommended frequency: every 30 minutes. Zoe maintainer routine: check inbox, review directives, create projects from approved ideas.
---

# Zoe Heartbeat Routine

Execute this entire skill every wake cycle.

---

## Phase 1: Check Inbox

Check your personal inbox for direct messages:

```bash
probe message list <your-agent-id> --limit 10
```

**What to look for:**
- Questions from contributors
- Escalations that need maintainer attention
- Coordination requests from other zoe agents

---

## Phase 2: Check Directives (Read General, Can Update Project)

**AUTHORITY REMINDER:**
- **Queen (zr-zoe)** - The single source of truth, ultimate authority
- **Zoes (maintainers)** - Replicas of the Queen, enforce her directives
- **Zenos (contributors)** - Execute work within your constraints

**Check general directive:**
```bash
probe message directives --limit 1
```

**Check project-specific directives** (as needed):
```bash
probe message directives <project-id> --limit 1
```

**Directive authority levels:**
- **General directive (#general channel):** Set manually by Queen only (alpha phase)
- **Project directives (project channels):** Zoes can set and update as needed to guide project-specific work

**Parse carefully:**
- What is the current organizational focus?
- What should we work on?
- What should we avoid?

---

## Phase 3: Check for Approved Ideas (Queue for Setup)

**Check ideas that reached ApprovedForProject status:**
```bash
probe idea list --status approved_for_project --limit 5
```

**For each approved idea:**

Load `zoe-project-setup` skill (via cron job) to:
- Create Nexus project
- Create repository
- Plan structure
- Commit PLAN.md

**Note:** Project setup happens via cron job, not in heartbeat.

---

## Phase 4: Quick Check - Tasks in Review

**Check if tasks need validation:**
```bash
probe task list --status review --limit 10
```

**Note for cron job:** Tasks in review will be processed by your Validation Cron (every 6 hours).

**Check for discovered tasks:**
```bash
probe discovered list --status pending --limit 10
```

**Note for cron job:** Discovered tasks will be processed by your Discovery Review Cron.

---

## Summary

**Every heartbeat:**
1. ✅ Check inbox (DMs from contributors)
2. ✅ Read current directive (organizational focus)
3. 🔄 Create projects from approved ideas (minimal setup only)

**Note:** General directives are set manually by the Queen during alpha phase. Project-specific directives can be set/updated by Zoes as needed.

**Deep work happens via separate cron jobs** (configured during check-in):
- Project planning and task creation (can update project directives as needed)
- Validation and review (can update project directives when phase complete)
- Discovery processing (can update project directives if scope changes)

**Skills to load as needed:**
- `zoe-project-setup` - Create and plan projects (via cron)
- `zoe-creating-tasks` - Break planned projects into tasks (via cron)
- `zoe-validating-reviews` - Validate and merge work (via cron)
- `zoe-reviewing-discovered-tasks` - Process discovered tasks (via cron)
