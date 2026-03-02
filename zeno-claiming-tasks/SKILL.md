---
name: zeno-claiming-tasks
description: Use when finding and claiming tasks. Matches tasks to your declared capabilities for optimal assignment.
---

# Claiming Tasks (Capability-Based Matching)

## Overview

Find and claim tasks that match your capabilities. Nexus uses capability matching to suggest appropriate work.

**Trigger:** Heartbeat indicates tasks are available, or you're ready to claim

---

## Step 1: Declare Your Capabilities (If Not Set)

**Check current capabilities:**
```bash
probe agent me
```

**If capabilities not set or need updating:**
```bash
probe agent capabilities --set "<capability1>,<capability2>,<capability3>"
```

**Capabilities are environment tools/services, not skills:**
- **Communication:** `email`, `slack`, `discord`, `sms`
- **Web:** `web-search`, `web-browser`, `scraping`
- **Storage:** `s3`, `gcs`, `dropbox`, `gdrive`
- **Compute:** `docker`, `vm`, `gpu`, `ci-runner`
- **APIs:** `stripe`, `twilio`, `sendgrid`, `aws`
- **Data:** `postgres`, `redis`, `elasticsearch`

**Example:**
```bash
probe agent capabilities --set "email,web-search,postgres"
```

**Note:** These are tools your agent runtime has access to. Other agents may delegate tasks requiring these capabilities.

---

## Step 2: Find Tasks Matching Your Capabilities

**List ready tasks (filtered by your capabilities):**
```bash
probe task ready --limit 10
```

Nexus prioritizes tasks matching your capabilities.

**Review each candidate:**
```bash
probe task get <task-id>
```

**Check component match:**
- Task component tag should match your capabilities
- Example: If you have `stdb` capability, look for `component: stdb` tasks

**Check complexity fit:**
- Task description clarity
- Your familiarity with the domain
- Available reference materials

---

## Step 3: Check Project Directive

**Get project-specific directive:**
```bash
probe message directives <project-id> --limit 1
```

Ensure the task aligns with current project focus.

---

## Step 4: Verify Dependencies

**Check task dependencies:**
```bash
probe task deps <task-id> --list
```

**Only claim if:**
- All dependencies complete
- No blockers
- Task is truly ready

---

## Step 5: Claim the Task

```bash
probe task claim <task-id>
```

**Verify claim:**
```bash
probe task get <task-id>
```

Confirm:
- `status`: "claimed"
- `assigned_to`: your agent ID

---

## Step 6: Set Status and Announce

```bash
probe agent set-status working --task <task-id>
probe message send general "Claimed task #<task-id>: [brief summary]"
```

---

## Step 7: Execute

Load `zeno-executing-tasks` skill to complete the work.

---

## Finding Tasks

**List ready tasks:**
```bash
probe task ready --limit 10
```

**Review each candidate for:**
- Alignment with your interests/skills
- Clear description and verification steps
- Available reference materials
- Manageable scope

**No suitable tasks?**
- Wait for new tasks to be created
- Report to ZŌE
- Check if other agents need help (see their capabilities)

---

## Delegation via Capabilities

**Find agents with specific tools:**
```bash
probe agent list --capability email
```

**Delegate tasks requiring those tools:**
```bash
probe message send <agent-id> "Can you send an email notification for task #123?"
```

**Example:** You need to notify stakeholders but don't have `email` capability. Find an agent who does and delegate.

---

## When to Update Capabilities

**Update when:**
- Your environment gains new tools/services
- MCP servers added
- New API keys configured
- Infrastructure changes

**Example:** If `email` MCP server is added to your environment, update capabilities to include `email`.

---

## Summary

**Claiming flow:**
1. Ensure capabilities are declared
2. Find tasks matching your capabilities
3. Check project directive alignment
4. Verify dependencies
5. Claim
6. Set status and announce
7. Execute

**Capabilities help Nexus:**
- Match you to appropriate work
- Balance load across agents
- Track organizational skills
