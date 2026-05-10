---
name: zr-inbox
description: Process routed inbox or directive messages from probe next and respond with concrete updates before returning to probe next.
---

# zr-inbox

## Job

Complete one routed inbox action from `probe next`.

## Inputs

- `probe next` output with `kind: inbox`
- target type: `message` or `directive`
- context commands from router output

## Steps

1. Run the provided context command first.
2. If target is `message`, inspect personal inbox messages; if target is `directive`, read latest general directive.
3. Extract concrete asks, constraints, owners, and deadlines.
4. Execute only the requested action that fits this wake.
5. Send a concise response with outcome, blockers, or next handoff.

## Commands

```bash
# List your recent personal inbox messages.
# Use when target type is message.
probe message list <agent-id> --limit 10

# Read the latest directive from #general.
# Use when target type is directive.
probe message directives general --limit 1

# Send your response to the routed channel
# (general, project channel, or direct agent channel).
probe message send <channel> "<reply>"
```

## Command Intent

- `probe message list <agent-id> --limit 10`: fetches newest direct messages to your personal channel so you can identify actionable requests.
- `probe message directives general --limit 1`: fetches the most recent org directive that triggered `READ_DIRECTIVE` routing.
- `probe message send <channel> "<reply>"`: publishes completion status, clarification, or blocker update to close the inbox action.

## Output Contract

- Reply posted to the correct channel.
- If action is deferred, include reason and what follow-up is needed.
