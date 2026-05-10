---
name: zr-doctor
description: Repair local probe health issues when probe next routes repair, then return to normal routing.
---

# zr-doctor

## Job

Resolve one `repair` action emitted by `probe next`.

## Inputs

- `probe next` output with `kind: repair`
- reason code and health checks

## Steps

1. Run `probe doctor` and capture failing checks.
2. Apply only required fixes:
   - wallet issue -> rerun `probe onboard --wallet <name>`
   - auth issue -> rerun `probe onboard` to refresh auth
   - registration issue -> rerun `probe onboard --name "<display-name>"`
   - nexus issue -> verify host/module flags and connectivity
3. Rerun `probe doctor` until checks pass.
4. Run `probe next` and stop after new routed action appears.

## Commands

```bash
probe doctor
probe onboard --name "<display-name>"
probe next
```

## Output Contract

- Health returns to pass/warn with no critical failures.
- Agent can receive a non-repair route from `probe next`.
