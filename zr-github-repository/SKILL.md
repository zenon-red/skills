---
name: zr-github-repository
description: Standardize zenon-red repository structure. Use when setting up a new zenon-red repo or ensuring consistency with organizational standards. Creates repositories from the nexus-template GitHub template, then customizes for the specific project.
---

# Zenon-Red Repository Setup

Create new repositories using the standard zenon-red template, then customize for your specific project.

## Template-Based Approach

All zenon-red repositories should be created from the `zenon-red/nexus-template` GitHub template:

```bash
gh repo create zenon-red/REPO_NAME --template zenon-red/nexus-template --public
```

Then clone and customize:
```bash
gh repo clone zenon-red/REPO_NAME
cd REPO_NAME
```

## Post-Template Customization

After creating from template, follow these steps to customize:

### 1. Replace Placeholders

Update all `REPO_NAME` placeholders with your actual repository name:

| File | Changes |
|------|---------|
| `README.md` | Replace `nexus-template` with repo name, update description |
| `.github/settings.yml` | Update `name:` and `description:` |
| `docs/setup.md` | Update references to `nexus-template` |
| `skills/REPO_NAME/SKILL.md` | Rename folder to actual repo name, update all content |

### 2. Update Logo

The template includes a placeholder logo `.github/nexus-template.png`. Replace it:

1. **Temporary:** Rename `nexus-template.png` to `zr-newborn.png` as a placeholder
2. **Final:** Create your actual 128px PNG logo and save as `.github/{repo-name}.png`
3. Update `README.md` to reference the correct logo file

```bash
# Rename placeholder first
git mv .github/nexus-template.png .github/zr-newborn.png
# Update README.md to point to zr-newborn.png temporarily
# Later, replace with actual logo:
git mv .github/zr-newborn.png .github/{repo-name}.png
```

### 3. Configure Tech Stack

Fill in the TODOs for your technology stack:

| File | Stack-Specific Changes |
|------|------------------------|
| `.github/workflows/ci.yml` | Uncomment/setup your toolchain (Node, Rust, Python, Go, Deno) |
| `.husky/pre-commit` | Add lint/format commands |
| `.husky/pre-push` | Add test/build commands |
| `.github/dependabot.yml` | Uncomment and configure your package ecosystem |
| `.gitignore` | Add stack-specific patterns |

### 4. Update CODEOWNERS (if needed)

Default is `@zenon-red/zoe`. Change if different ownership is required:
```
# .github/CODEOWNERS
* @zenon-red/team-name
```

### 5. Update Documentation

**Remove template-specific files:**
- `docs/setup.md` - This is only for setting up from the template, remove after customization

**Create user-facing docs in `docs/`:**
- `getting-started.md` - Installation and first steps
- `commands.md` - CLI commands or API reference
- `architecture.md` - Technical architecture overview
- `examples.md` - Usage examples

Update `docs/README.md` index to:
1. Remove the link to `setup.md`
2. Add links to your new project-specific docs

### 6. Write Repo-Specific Skill

Replace the placeholder `skills/{repo-name}/SKILL.md` with actual guidance:
- Tech stack details
- Project architecture
- Development commands (build, test, lint)
- Agent-specific guidelines and pitfalls

### 7. Install Dependencies & Setup Hooks

```bash
# Install your package manager dependencies
npm install  # or cargo, pip, go mod, etc.

# Initialize husky (if using Node.js)
npx husky init
```

### 8. First Commit

```bash
git add .
git commit -m "chore: initial setup from nexus-template"
git push -u origin main
```

### 9. Apply Branch Protection

After first push to `main`, apply branch protection via the API (free tier — does not require paid GitHub Team plan):

```bash
gh api repos/zenon-red/REPO_NAME/branches/main/protection \
  -X PUT \
  -f "enforce_admins=false" \
  -f "required_pull_request_reviews[required_approving_review_count]=0" \
  -f "required_pull_request_reviews[dismiss_stale_reviews]=true" \
  -f "required_pull_request_reviews[require_code_owner_reviews]=true" \
  -f "restrictions=null" \
  -f "allow_force_pushes=false" \
  -f "allow_deletions=false"
```

This sets:
- No force pushes to main
- No branch deletions
- PR required before merge
- CODEOWNERS review required (from `.github/CODEOWNERS`)
- Stale reviews dismissed on new pushes
- Admins can bypass (org owner override via `enforce_admins=false`)

**Note:** This uses the branch protection endpoint available on all GitHub plans. Do NOT use rulesets (`/repos/.../rulesets`) — that requires a paid GitHub Team plan.

## Target Structure (After Template + Customization)

```
repo/
├── .github/
│   ├── {repo}.png              # Logo (128px) - replace zr-newborn.png placeholder
│   ├── CODEOWNERS             # Code owners (@zenon-red/zoe default)
│   ├── dependabot.yml         # Dependency updates (configure for your stack)
│   ├── labeler.yml            # PR label patterns
│   ├── settings.yml           # Repo settings and labels
│   └── workflows/
│       ├── ci.yml             # Stack-specific CI pipeline
│       ├── labeler.yml        # Auto-label PRs
│       └── stale-issues-prs.yml
├── .husky/
│   ├── commit-msg             # Commit message validation (optional)
│   ├── pre-commit             # Pre-commit checks (lint, format)
│   └── pre-push               # Pre-push checks (test, build)
├── docs/                      # Documentation
│   ├── README.md              # Docs index (remove setup.md link)
│   ├── getting-started.md     # (create as needed)
│   └── ...                    # Other user docs (setup.md removed)
├── skills/
│   └── {repo-name}/
│       └── SKILL.md           # Repo-specific agent guidance
├── src/                       # Source code (create for your stack)
├── .gitignore                 # Stack-specific ignore patterns
├── CONTRIBUTING.md            # Contribution guidelines (can override org)
├── LICENSE                    # MIT license
├── README.md                  # Main project README
└── {config files}             # package.json, Cargo.toml, etc.
```

## Stack-Specific Hook Examples

### pre-commit
```bash
# TypeScript/JavaScript
npm run lint:staged && npm run typecheck

# Rust
cargo fmt --check && cargo clippy

# Python
ruff check . && mypy .

# Go
go fmt ./... && go vet ./...

# Deno
deno lint && deno check
```

### pre-push
```bash
# TypeScript/JavaScript
npm run check:push

# Rust
cargo test && cargo clippy -- -D warnings

# Python
pytest && ruff check .

# Go
go test ./... && go build ./...

# Deno
deno test && deno lint
```

## Labels (In Template)

The template includes these labels in `.github/settings.yml`:

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | d73a4a | Something isn't working |
| `feature` | 0e8a16 | New feature or request |
| `task` | 6f42c1 | Planned implementation work item |
| `documentation` | 0075ca | Documentation improvements |
| `doc` | 0075ca | Documentation changes (PR label) |
| `code` | 1d76db | Source code changes |
| `dep` | 0366d6 | Dependency updates |
| `config` | 5319e7 | Configuration changes |
| `pinned` | fbca04 | Exempt from stale bot |

**Note:** Do not remove the `task` label - it's used by org-level issue templates.

## Org-Level Inherited Files

These files are inherited from `zenon-red/.github/` when not present:

| File | Inherited? | Notes |
|------|------------|-------|
| `PULL_REQUEST_TEMPLATE.md` | ✅ Yes | Org-level PR template |
| `.github/ISSUE_TEMPLATE/*` | ✅ Yes | Bug, feature, task, docs forms |
| `CONTRIBUTING.md` | ✅ Yes (fallback) | Template includes a copy; can override |

## Checklist

Before considering setup complete:

- [ ] Repository created from `zenon-red/nexus-template`
- [ ] `README.md` updated with actual project name and description
- [ ] `.github/settings.yml` has correct name/description
- [ ] Logo renamed from `nexus-template.png` → `zr-newborn.png` (temp) or replaced with actual logo
- [ ] `README.md` logo reference updated
- [ ] `skills/{repo}/SKILL.md` renamed and customized
- [ ] `.github/dependabot.yml` configured for package ecosystem
- [ ] `.github/workflows/ci.yml` configured for tech stack
- [ ] `.husky/pre-commit` has appropriate lint/format commands
- [ ] `.husky/pre-push` has appropriate test/build commands
- [ ] `.gitignore` has stack-specific patterns
- [ ] `docs/setup.md` removed (template-specific)
- [ ] `docs/getting-started.md` or equivalent created
- [ ] Dependencies installed and `package.json`/`Cargo.toml`/etc. configured
- [ ] First commit pushed to main
- [ ] Branch protection applied (via API, not rulesets)
- [ ] All TODO comments in files addressed or removed

## Important Notes

- **Never** create repos from scratch - always use `--template zenon-red/nexus-template`
- **Always** keep the `task` label - it's required by org issue templates
- **Always** verify husky hooks are executable: `chmod +x .husky/*`
- The Probot Settings bot will sync labels and repo settings after first push
