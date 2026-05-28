---
name: nexus-repository-setup
description: Create a new repository from the org's standard template, then customize for the project.
---

# nexus-repository-setup

## Mission

Create a new GitHub repository using the organization's standard template. This ensures consistent structure, CI, labels, and branch protection across all repos.

## Workflow

1. Get the org name:

   ```bash
   probe action show <action-id> --json
   ```

   Extract `org.github_org` from the output. Use this as `<org>` in all commands.

2. Create the repo from the org's template:

   ```bash
   gh repo create <org>/<repo-name> --template <org>/nexus-template --public
   ```

   - Use a short, descriptive repo name derived from the project title.
   - Always use `--template <org>/nexus-template` — never create repos from scratch.

3. Clone and customize:

   ```bash
   gh repo clone <org>/<repo-name>
   cd <repo-name>
   ```

4. Replace Placeholders — update all `nexus-template` references with the actual repo name:

   | File | Changes |
   |------|---------|
   | `README.md` | Replace `nexus-template` with repo name, update description |
   | `.github/settings.yml` | Update `name:` and `description:` |
   | `docs/setup.md` | Update references to `nexus-template` |
   | `skills/<repo-name>/SKILL.md` | Rename folder to actual repo name, update all content |

5. Update Logo:

   The template includes a placeholder logo `.github/nexus-template.png`. Replace it:

   1. **Temporary:** Rename `nexus-template.png` to `<repo-name>.png` as a placeholder
   2. **Final:** Create your actual 128px PNG logo and save as `.github/<repo-name>.png`
   3. Update `README.md` to reference the correct logo file

   ```bash
   # Rename placeholder first
   git mv .github/nexus-template.png .github/<repo-name>.png
   # Update README.md to point to <repo-name>.png
   ```

6. Configure Tech Stack — fill in the TODOs for your technology stack:

   | File | Stack-Specific Changes |
   |------|------------------------|
   | `.github/workflows/ci.yml` | Uncomment/setup your toolchain (Node, Rust, Python, Go, Deno) |
   | `.husky/pre-push` | Add test/build commands |
   | `.github/dependabot.yml` | Uncomment and configure your package ecosystem |
   | `.gitignore` | Add stack-specific patterns |

   The `.husky/pre-commit` hook is pre-configured to enforce the Nexus commit policy (`.github/nexus-commit-policy.md`). Do not replace it — add stack-specific lint commands to `.husky/pre-push` instead. See [references/hook-examples.md](references/hook-examples.md).

   The commit policy can be customized per repo by editing `.github/nexus-commit-policy.md`. See [references/commit-policy.md](references/commit-policy.md).

7. Update CODEOWNERS (if needed):

   Default is `@<org>/zoe`. This requires the org to have a GitHub team named `zoe`. Change if different ownership is required:

   ```
   # .github/CODEOWNERS
   * @<org>/<team-name>
   ```

8. Update Documentation:

   **Remove template-specific files:**
   - `docs/setup.md` — this is only for setting up from the template, remove after customization

   **Create user-facing docs in `docs/`:**
   - `getting-started.md` — installation and first steps
   - `commands.md` — CLI commands or API reference
   - `architecture.md` — technical architecture overview
   - `examples.md` — usage examples

   Update `docs/README.md` index to:
   1. Remove the link to `setup.md`
   2. Add links to your new project-specific docs

9. Write Repo-Specific Skill:

   Replace the placeholder `skills/<repo-name>/SKILL.md` with actual guidance:
   - Tech stack details
   - Project architecture
   - Development commands (build, test, lint)
   - Agent-specific guidelines and pitfalls

10. Install Dependencies & Setup Hooks:

    ```bash
    # Install your package manager dependencies
    npm install  # or cargo, pip, go mod, etc.

    # Initialize husky (if using Node.js)
    npx husky init
    ```

11. First Commit:

    ```bash
    git add .
    git commit -m "chore: initial setup from nexus-template"
    git push -u origin main
    ```

12. Apply Branch Protection:

    After first push to `main`, apply branch protection via the API (free tier — does not require paid GitHub Team plan):

    ```bash
    gh api repos/<org>/<repo-name>/branches/main/protection \
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

## Probe Commands

```bash
# Actions
probe action show <id> --json          # Get org.github_org

# GitHub
gh repo create <org>/<name> --template <org>/nexus-template --public
gh repo clone <org>/<name>
gh api repos/<org>/<name>/branches/main/protection -X PUT ...
```

## References

- [Target structure](references/target-structure.md) — expected repo layout after setup
- [Hook examples](references/hook-examples.md) — pre-push examples by stack
- [Commit policy](references/commit-policy.md) — how the Nexus commit policy hook works
- [Labels and inheritance](references/labels-and-inheritance.md) — template labels and org-inherited files

## Checklist

Before considering setup complete:

- [ ] Repository created from `<org>/nexus-template`
- [ ] `README.md` updated with actual project name and description
- [ ] `.github/settings.yml` has correct name/description
- [ ] Logo renamed from `nexus-template.png` → `<repo-name>.png` (temp) or replaced with actual logo
- [ ] `README.md` logo reference updated
- [ ] `skills/<repo>/SKILL.md` renamed and customized
- [ ] `.github/dependabot.yml` configured for package ecosystem
- [ ] `.github/workflows/ci.yml` configured for tech stack
- [ ] `.husky/pre-commit` — commit policy hook intact (do not replace)
- [ ] `.husky/pre-push` has appropriate test/build commands
- [ ] `.github/nexus-commit-policy.md` reviewed, repo-specific rules added if needed
- [ ] `.gitignore` has stack-specific patterns
- [ ] `docs/setup.md` removed (template-specific)
- [ ] `docs/getting-started.md` or equivalent created
- [ ] Dependencies installed and `package.json`/`Cargo.toml`/etc. configured
- [ ] First commit pushed to main
- [ ] Branch protection applied
- [ ] All TODO comments in files addressed or removed

## Quality

- **Always use the template** — never create repos from scratch.
- **Replace all placeholders** — no `nexus-template` references should remain.
- **Apply branch protection** — do this after the first push to main.
- **Keep the `task` label** — it's required by org issue templates.
- **Always verify husky hooks are executable:** `chmod +x .husky/*`

## Boundaries

- Do not write project code — this skill only sets up the repo structure.
- Do not create issues or PRs — that's for other skills.
- Do not modify the template itself — use it as-is.
