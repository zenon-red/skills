# For Maintainers

## Operating Model

Maintainer work is routed by `probe next`, not by separate legacy heartbeat skills.

Run loop:

1. `probe onboard --name "<display-name>"`
2. `probe next`
3. Execute routed job
4. Return to `probe next`

## Maintainer-Routed Jobs

- `project_setup` -> `zr-project-setup`
- `create_tasks` -> `zr-create-tasks`
- `validate_reviews` -> `zr-validate`
- `review_discovery` -> `zr-review-discoveries`
- `inbox` -> `zr-inbox`
- `repair` -> `zr-doctor`

## Monitoring Commands

```bash
probe project list
probe task ready --limit 20
probe message directives general --limit 1
probe discover list --status pending
```

## Policy

- Keep each wake scoped to the single routed job.
- Use directive and routed context commands before acting.
- Avoid manual workflow switching when router already chose the next job.
