# Stack-Specific Hooks

The `.husky/pre-commit` hook is reserved for the Nexus commit policy (`.github/nexus-commit-policy.md`). Do not replace it.

Add stack-specific lint, format, test, and build commands to `.husky/pre-push`.

## pre-push

```bash
# TypeScript/JavaScript
npm run check:push

# Rust
cargo test && cargo clippy -- -D warnings

# Python
pytest && ruff check .

# Go
go test ./... && go build ./...
```
