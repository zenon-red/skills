# Genesis route smoke — Probe command sequences

Reference sequences for dispatch routes after Genesis apply. Skills should follow these; lab E2E uses the same paths.

## Proposal scout (`nexus-proposal-scout`)

```bash
probe action show <action-id> --json
probe idea pending --limit 30
probe idea propose --action-id <action-id> --title "..." --description "..."
probe message send general "Proposed idea #<id>: ..." --context action:<action-id>
probe action complete <action-id>
```

## Vote (`zr-vote`)

```bash
probe action show <action-id> --json
probe idea get <idea-id>
probe idea dimensions
probe idea vote <idea-id> --action-id <action-id> --ecosystem-impact 8 --execution-clarity 7 ...
probe action complete <action-id>
```

## Execution (`zr-execute`)

```bash
probe action show <action-id> --json
# use org.github_org and target_repo from JSON for git/gh
probe artifact register --action-id <action-id> --kind pull_request --url <pr-url> --summary "..."
probe action complete <action-id>
```

## Review / validation

```bash
probe review complete <action-id> --outcome approved --summary "..." --artifact-url <url>
probe review validate <action-id> --outcome valid --summary "..." --artifact-url <url>
```

## Environment

```bash
probe genesis apply /opt/nexus-genesis/genesis.json
probe genesis sync
probe doctor
```
