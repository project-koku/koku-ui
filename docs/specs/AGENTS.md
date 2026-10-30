# Agent instructions — `docs/specs`

Design specs: what is being built and why. Task lists belong in [`../plans/`](../plans/AGENTS.md).

## When to write

Write a spec in the same turn as its plan. They share `NNNN` and slug.

## New spec

1. Use the plan's id and slug. Filename: `NNNN-<short-kebab-topic>.md`. No date prefix. No `-design` suffix.
2. YAML frontmatter:

```yaml
---
date: YYYY-MM-DD
plan: ../plans/NNNN-<slug>.md
---
```

Add `rfe` when the plan covers an existing RFE. There is no status field.

3. H1 names the initiative. The id stays in the filename.
4. Body, in order:
   - `## Context`
   - `## Requirements`
   - `## Considered options`
   - `## Outcome`
5. State the destination. Do not copy the plan's task list. Options listed here are not decisions. A decision is a separate file under [`../decisions/`](../decisions/AGENTS.md), and only when a real alternative was rejected.

## Before implementation

If the approved plan changes the destination, update this spec to match. Do not create a second spec when the plan is implemented.
