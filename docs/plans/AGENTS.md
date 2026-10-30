# Agent instructions — `docs/plans`

Implementation plans saved from Cursor. Design intent lives in [`../specs/`](../specs/AGENTS.md).

## When to write

Write a plan when a Cursor plan is created for a non-trivial change: Plan mode, or any multi-step plan. In the same turn, write the paired spec. See [`../specs/AGENTS.md`](../specs/AGENTS.md).

A one-step edit that never becomes a plan does not get a file. Implementing a plan does not create a second plan or spec.

## New plan

1. If the plan covers an existing RFE, use that RFE's `NNNN`. Otherwise take the next effort id from [`../AGENTS.md`](../AGENTS.md). The paired spec uses the same id and slug. Decisions for this plan use this `NNNN`, the next `MMM`, and their own slugs.
2. Filename: `NNNN-<short-kebab-topic>.md`. No date prefix. No `-plan` suffix.
3. Save the Cursor plan as written. Do not add an execution-skill banner.
4. YAML frontmatter, then the plan:

```yaml
---
date: YYYY-MM-DD
spec: ../specs/NNNN-<slug>.md
---
```

Add `rfe` or `decisions` only when those files exist and point at this plan. `decisions` is a list of relative paths. There is no status field.

5. H1 is the plan title. The id stays in the filename.

## Before implementation

If the user edits the plan before implementation, overwrite this file with the approved text at the start of implementation. Update the paired spec when the destination changed. Follow [`../decisions/AGENTS.md`](../decisions/AGENTS.md) when the edit changes a choice or introduces a fork.
