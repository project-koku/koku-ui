---
status: accepted
date: 2026-10-30
---

# Number decisions with an effort sub-counter

## Context and Problem Statement

Decisions for one effort share the plan's counter, and the slug is what distinguishes them (`0001-empty-docs-tree.md`, `0001-save-every-nontrivial-plan.md`). Listing the folder shows they belong together, but there is no sequence. A short reference has to repeat the whole slug.

How should several decisions for one plan be told apart?

## Considered Options

- Keep `NNNN-<slug>.md` and rely on the slug
- Use `NNNN-MMM-<slug>.md`, where `MMM` is a three-digit sequence for that effort

## Decision Outcome

Chosen option: **`NNNN-MMM-<slug>.md`**. `NNNN` stays the effort, shared with the plan and spec. `MMM` starts at `001` and increases by one for each later decision on that effort. The slug stays the topic.

The sub-counter is only the second group on a decision filename. Plans, specs, and RFEs stay `NNNN-<slug>.md`. `supersedes` and `superseded-by` store the full decision filename.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because the decisions for a plan sort as `0001-001`, `0001-002`, and so on.
- Good, because a reference can use `0001-003` without the slug.
- Bad, because a decision filename is longer, and the second number must not be read as a new effort id.
