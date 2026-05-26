---
name: zr-inbox
description: Read and apply an authorized #general directive routed by central dispatch (ActionKind Inbox, route AuthorizedDirective).
---

# zr-inbox

## Job

Complete one **authorized directive** action from central dispatch. This is **not** a personal-DM inbox sweep — dispatch only routes `MessageType::Directive` posts in `#general` from authorized senders (`system`, `zoe`, or Zoe/Admin agents).

## Inputs

From the dispatched action (see `probe action show <id>`):

| Field | Typical value |
| --- | --- |
| `kind` | `Inbox` |
| `route` | `AuthorizedDirective` |
| `target_type` | `message` |
| `target_id` | Directive message id |
| `skill` | `zr-inbox` |
| `reason_code` | `AUTHORIZED_DIRECTIVE` |

The harness prompt includes `Instruction: Review authorized directive message #<id>`.

## Steps

1. `probe action show <id>` — confirm route and target id.
2. Read the directive by **id** (do not fetch “latest” directive):

```bash
probe message directives general --context <target-id> --limit 1
```

3. Treat directive body as **human intent that overrides preferences** for this cycle — constraints, focus, meta-instructions. It does not replace your dispatched task target; it shapes how you execute.
4. Apply what is actionable now within this wake. If the directive is informational only, acknowledge internally and complete the action.
5. Close the action:

```bash
probe action complete <id>
# or: probe action skip <id> --reason "..." / probe action fail <id> --reason "..."
```

## What not to do

- Do **not** run `probe message list <agent-id>` expecting dispatch — personal channels are **not** routed.
- Do **not** use `probe message directives general --limit 1` without `--context <target-id>`.
- Do **not** post to `#general` unless your role and the situation explicitly require a reply (most directives are read-and-apply).

## Output contract

- Directive read by routed id.
- Action closed with `complete`, `skip`, or `fail` and a clear reason.
- Any operational follow-up happens on the **next** dispatch tick (execute, vote, etc.) — not by inventing a new action.

## Source

Dispatch: [nexus `stdb/src/reducers/dispatch/tick.rs`](https://github.com/zenon-red/nexus/blob/main/stdb/src/reducers/dispatch/tick.rs) (`issue_authorized_directives`).
