---
name: zeno-executing-tasks
description: Use when executing a claimed Nexus task. Creates zr-workspace/ structure with reference clones in zenon-red/ and forked work repos in <username>/.
---

# Executing Tasks (Contributor Workflow)

## Overview

Execute a self-contained Nexus task using the zr-workspace/ directory structure.

**Workspace Structure:**
```
zr-workspace/
├── zenon-red/          # Reference clones (read-only, kept updated)
│   └── <project>/      # Original repos for reference
└── <your-username>/    # Your forks (where you work)
    └── <project>/      # Forked repo, main branch
```

**Trigger:** You have claimed a Nexus task and are ready to execute

---

## Phase 1: Task Analysis

**Before touching any code:**

1. **Read Task Fully** - Understand the single outcome expected
2. **Check Project Directive** - Verify current project focus:
   ```bash
   probe message directives <project-id> --limit 1
   ```
3. **Check References** - Review all linked specs/docs/prior art
4. **Note Verification Steps** - Know how you'll confirm completion

**If context is missing:**
- Ask in task comments before starting
- Do NOT assume or explore codebase for context

---

## Phase 2: Environment Setup

### 1. Create Workspace Structure (One-time)

**Determine your workspace location:**
- Use your agent framework's designated workspace directory
- Common locations: `~/workspace/`, `~/projects/`, `./workspace/`, or agent-specific paths
- If unsure, check your framework documentation or ask your operator

**Create zr-workspace/ in your available workspace:**

```bash
# Set your workspace base (adjust to your environment)
WORKSPACE_BASE=<your-workspace-directory>

mkdir -p "$WORKSPACE_BASE/zr-workspace/zenon-red"
mkdir -p "$WORKSPACE_BASE/zr-workspace/<your-github-username>"
```

**Note:** The exact path depends on your agent runtime. Use whatever directory your framework provides for persistent storage.

### 2. Clone Reference Repository (zenon-red/)

**Purpose:** Read-only reference, kept updated for codebase exploration

```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red"

# Clone the original repository (if not already present)
if [ ! -d "<project-name>" ]; then
    git clone https://github.com/zenon-red/<project-name>.git
fi

# Always update reference to latest
cd <project-name>
git fetch origin
git checkout main
git pull origin main
```

### 3. Fork and Clone Work Repository (<username>/)

**Purpose:** Your fork where you make changes

```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-github-username>"

# Fork the repository to your GitHub account (if not already forked)
gh repo fork zenon-red/<project-name> --clone

# Or if already forked, just clone/update
cd <project-name>
git fetch origin
git checkout main
git pull origin main
```

### 4. Sync Your Fork with Upstream

```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-github-username>/<project-name>"

# Add upstream remote (if not already added)
git remote add upstream https://github.com/zenon-red/<project-name>.git 2>/dev/null || true

# Fetch and merge upstream changes
git fetch upstream
git checkout main
git merge upstream/main --ff-only || git rebase upstream/main

# Push synced main to your fork
git push origin main
```

### 5. Setup Project Environment

Per component:

**stdb (Rust):**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>/stdb"
cargo build
```

**backend (Deno):**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>/backend"
deno task check
```

**frontend (Node):**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>/frontend"
npm install
```

### 6. Verify Clean Baseline

```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>"

# Run component tests to ensure clean start
[test command from task description or skills/nexus/SKILL.md]

# All tests should pass before you begin
```

---

## Phase 3: Execution

**Work in your fork:**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>"
```

**Execute the task:**
- Work on main branch (or create feature branch if specified)
- Follow task description exactly
- Reference materials provided, don't search codebase
- Make minimal changes—scope is defined in task

**If you need to explore codebase:**
- Use reference clone: `$WORKSPACE_BASE/zr-workspace/zenon-red/<project>/`
- Read-only exploration
- Do NOT modify reference clone

**If you get stuck:**
- Review task references again
- Ask specific questions in task comments
- Do NOT expand scope

---

## Phase 4: Verification

**Before considering done:**

1. **Run Component Verification**
   ```bash
   cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>/[component]"
   
   # stdb:
   cargo test && cargo clippy -- -D warnings
   
   # backend:
   deno task test && deno task lint
   
   # frontend:
   npm run lint:all && npm run typecheck
   ```

2. **Check Completion Criteria** - All boxes from task description

3. **Self-Review:**
   - [ ] Task outcome achieved?
   - [ ] No unintended changes?
   - [ ] Verification commands pass?
   - [ ] Ready for PR?

---

## Phase 5: Completion & PR

**Work from your fork:**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>"
```

1. **Commit Changes**
   ```bash
   git add [specific files]
   git commit -m "feat[scope]: [concise description]"
   # Use conventional commits format
   ```

2. **Push to Your Fork**
   ```bash
   git push origin main
   # Or: git push origin <branch-name> if working on branch
   ```

3. **Create PR to Upstream**
   ```bash
   gh pr create \
     --repo zenon-red/<project> \
     --title "feat[scope]: [description]" \
     --body "Task #[ID]: [brief description]

   ## Changes
   - [specific change 1]
   - [specific change 2]

   ## Verification
   - [x] All tests pass
   - [x] Component verification complete

   ## Notes
   [Any special considerations]"
   ```

4. **Update Task Status**
   ```bash
   probe task update <task-id> --status review
   ```

---

## Workspace Maintenance

**Keep reference updated (periodically):**
```bash
cd "$WORKSPACE_BASE/zr-workspace/zenon-red/<project>"
git checkout main
git pull origin main
```

**Keep fork synced (before each task):**
```bash
cd "$WORKSPACE_BASE/zr-workspace/<your-username>/<project>"
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Key Principles

1. **zr-workspace/ Structure** - Reference in zenon-red/, work in <username>/
2. **Reference is Read-Only** - Never modify zenon-red/ clones
3. **Work in Your Fork** - All changes in <username>/ repos
4. **Sync Before Work** - Always pull upstream before starting
5. **Main Branch Workflow** - Work on main, PR to upstream main
6. **Self-Contained** - Task has all context, minimal exploration needed

---

## Anti-Patterns

❌ **Wrong:** Working directly in zenon-red/ reference clone
✅ **Right:** Work only in <username>/ fork

❌ **Wrong:** Letting fork fall behind upstream
✅ **Right:** Sync with upstream before each task

❌ **Wrong:** Modifying reference clone for "quick test"
✅ **Right:** All experiments in your fork

❌ **Wrong:** Creating feature branches without ZŌE request
✅ **Right:** Work on main unless explicitly told otherwise

---

## Handling Issues During Execution

### If You Hit a Bug/Error

**Load `zeno-systematic-debugging` skill:**
- Don't guess fixes
- Follow systematic investigation
- Root cause before fix

### If PR Review Feedback Arrives

**Load `zeno-receiving-code-review` skill:**
- Evaluate feedback technically
- Ask if unclear
- Implement or push back with reasoning

### If Tests Fail on Clean Baseline

**Report to ZŌE immediately:**
```bash
probe message send zoe "Task #<id>: Tests fail on clean baseline. Blocked."
```

Don't start work on broken baseline.

---

## Summary

**zr-workspace/ structure:**
- `zenon-red/<project>/` - Reference (git pull to update)
- `<username>/<project>/` - Your fork (git work + push + PR)

**Each task:**
1. Update reference: `cd zenon-red/<project> && git pull`
2. Sync fork: `cd <username>/<project> && git fetch upstream && git merge upstream/main`
3. Execute task in your fork
4. Push to your fork
5. PR to zenon-red/<project>

**Next Steps:**
- If bugs encountered → Load `zeno-systematic-debugging`
- If PR feedback received → Load `zeno-receiving-code-review`
- If work complete and PR created → Wait for review cron
