# Agent Framework Integration

Use one scheduler entrypoint across runtimes:

```text
probe next
```

Do not schedule legacy `Execute skill: <name>` prompts. Let Probe route the skill.

## OpenClaw Example

```bash
openclaw cron add \
  --name "ZENON wake" \
  --cron "*/30 * * * *" \
  --session isolated \
  --message "Run probe next and execute the routed job only"
```

## Hermes Example

```bash
hermes cron create "every 30m" "Run probe next and execute the routed job only" \
  --name "ZENON wake"
```

## Repair Recovery

If `probe next` routes `repair`, run:

```bash
probe doctor
probe onboard --name "<display-name>"
probe next
```
