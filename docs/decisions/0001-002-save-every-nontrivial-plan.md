---
status: accepted
date: 2026-10-30
---

# Save every non-trivial Cursor plan

## Context and Problem Statement

A Cursor plan lives in the chat until something writes it into the repo. The next session does not see it. When should that write happen?

## Considered Options

- Save a plan whenever one is created for a non-trivial change, including Plan mode
- Save a plan only when asked

## Decision Outcome

Chosen option: **save every non-trivial Cursor plan**, because the point of `docs/plans/` is that the plan exists for the next session without a separate request to file it. A one-step edit that never becomes a plan does not get a file.

The paired spec is written in the same turn. The always-on rule is `.cursor/rules/repo-docs.mdc`.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because Plan mode leaves a spec and a plan in the repo.
- Bad, because a multi-step plan is recorded even when the author did not ask for a file. The one-step exclusion is what keeps typos and other single edits out.
