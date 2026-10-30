---
status: accepted
date: 2026-10-30
---

# Write an RFE only for a proposal that is not being planned

## Context and Problem Statement

docs-store has two RFEs. One was the proposal itself, with no plan. The other was an unfinished plan moved into `rfes/` after its spec was deleted. Neither was created beside an active plan.

A Cursor plan already has a plan file and a spec. Should it also write an RFE?

## Considered Options

- Write an RFE with every plan
- Write an RFE only for proposed work that is not being planned yet
- Write an RFE only when given a Jira issue, and base the file on that issue

## Decision Outcome

Chosen option: **write an RFE only for a proposal that is not being planned**. The user asks to capture an enhancement and does not ask for a plan. A plan and its spec stand on their own.

If that proposal is planned later, the new plan and spec link to the existing RFE. Include a Jira link when the user gave one. Jira remains the tracker for ticket status.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because a planned effort is not filed twice, once as a request and once as a plan.
- Bad, because a planned effort has no RFE unless one was written before planning. The spec holds the destination in that case.
