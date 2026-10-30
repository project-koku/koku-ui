---
status: accepted
date: 2026-10-30
---

# Write a decision only when a real alternative is rejected

## Context and Problem Statement

A plan already states the approach, and the spec states the destination. Writing a decision for every plan would repeat those files. docs-store wrote an ADR only after a real choice, often several for one feature, and none for plans that had no fork.

When should this repo write `docs/decisions/`?

## Considered Options

- Write one decision with every plan
- Write a decision only when a real alternative was rejected, for a reason a later session would otherwise redo
- Write a decision only after implementation, and only if the approach changed

## Decision Outcome

Chosen option: **write a decision only when a real alternative was rejected**. One fork, one file, in MADR 4 minimal form, using the plan's counter and its own slug, with a link to the plan. Options already listed in the spec do not become a decision by themselves. A plan with no such fork gets no decision.

If a later choice reverses an accepted decision, leave the original outcome as written and add a new decision that supersedes it.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because a decision records a rejected alternative, which is the part the spec does not keep on its own.
- Bad, because a session can finish with no decision file even though a plan and spec exist. That is the intended case when nothing was rejected.
