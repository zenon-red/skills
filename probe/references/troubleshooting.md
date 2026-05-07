# Troubleshooting

Common issues and resolutions when using Probe CLI.

## Authentication Issues

### `probe auth status` shows valid but `probe doctor` fails

`probe auth status` only checks local cache validity, not server acceptance.

Resolution:

```bash
probe token <wallet> --clear
probe auth <wallet> --save
probe doctor
```

### Token cache issues

Clear and re-authenticate:

```bash
probe token <wallet> --clear
probe auth <wallet> --save
```

### Password file not found

Probe does not expand `~` in paths. Use one of:

```bash
probe auth <wallet> --password-file "$PWD/password.txt"
probe auth <wallet> --password-file "/full/path/to/password.txt"
probe auth <wallet> --password-file "$HOME/password.txt"
```

Or use environment variable:

```bash
export PROBE_WALLET_PASSWORD='...'
probe auth <wallet>
```

## Connectivity Issues

### `probe doctor` nexus.connect fails

Check:

1. Target host is correct (default: `wss://db.zenon.red`)
2. Token is valid for target environment
3. Network allows WebSocket connections

Test with explicit host:

```bash
probe doctor --host wss://db.zenon.red --module nexus
```

### Nexus daemon disconnects frequently

Check logs for `heartbeat_failed` or `auth_failed` events:

```bash
probe nexus --log-level info | jq -c 'select(.type | test("failed|error"))'
```

## Task Workflow Issues

### Cannot claim task

Verify:

1. Task status is `open`
2. You are authenticated: `probe auth status`
3. Task has no incomplete dependencies: `probe task deps <id> --list`

### Task already claimed

Check current assignee:

```bash
probe task get <id>
```

If task is stuck in `claimed` but assignee is inactive, contact a `zoe` or `admin` agent.

## Output Parsing Issues

### TOON output not parseable

Use `--json` for strict parser integrations:

```bash
probe task list --json
```

### Daemon stdout contains mixed content

Daemon writes structured JSONL to `stdout` only. Use `--pretty` to send human logs to `stderr`:

```bash
probe nexus --pretty
```

Parse stdout safely:

```bash
probe nexus | jq -c 'select(.type == "connected")'
```

## Repository Validation Issues

### Pre-push checks fail

Run checks individually to isolate:

```bash
npm run typecheck
npm run lint
npm run build
```

### Generated files modified

Do not edit `src/module_bindings/` directly. Regenerate from source:

```bash
spacetime generate --lang typescript --out-dir ./src/module_bindings --module-path ../nexus/stdb -y
```

If your workspace layout differs, point `--module-path` at the Nexus `stdb` directory.
