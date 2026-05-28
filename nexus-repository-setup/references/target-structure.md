# Target Repository Structure

After template + customization, the repo should look like this:

```
repo/
├── .github/
│   ├── {repo}.png              # Logo (128px)
│   ├── CODEOWNERS              # Code owners
│   ├── dependabot.yml          # Dependency updates
│   ├── labeler.yml             # PR label patterns
│   ├── nexus-commit-policy.md  # Org-wide commit policy (read by pre-commit hook)
│   ├── settings.yml            # Repo settings and labels
│   └── workflows/
│       ├── ci.yml              # Stack-specific CI pipeline
│       ├── labeler.yml         # Auto-label PRs
│       └── stale-issues-prs.yml
├── .husky/
│   ├── pre-commit              # Commit policy hook (prints policy, blocks until followed)
│   └── pre-push                # Test, build
├── docs/
├── skills/
│   └── {repo-name}/
│       └── SKILL.md
├── src/
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```
