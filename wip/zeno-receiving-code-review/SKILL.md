---
name: zeno-receiving-code-review
description: Deprecated compatibility skill. Use zr-execute and zr-validate routed jobs from central dispatch.
---

# Deprecated

This legacy skill is retained for compatibility only.

Use the routed job flow instead:

1. Read dispatched action context
2. Follow routed skill (`zr-execute` or `zr-validate`)
3. Return control and wait for next dispatch tick
