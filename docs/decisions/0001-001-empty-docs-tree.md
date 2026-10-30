---
status: accepted
date: 2026-10-30
---

# Start the docs tree empty

## Context and Problem Statement

docs-store already holds koku-ui plans, specs, RFEs, and decisions. This repo is adding the same kind of tree. Should those existing records be copied in as the starting history?

The layout is the example. The records were written for another checkout, and several plans are execution scripts from an older skill.

## Considered Options

- Copy the whole docs-store tree
- Copy decisions and specs only
- Start with empty folders and conventions

## Decision Outcome

Chosen option: **start with empty folders and conventions**, because the copied plans and RFEs would become instructions for the next session, including task steps and file paths that this repo did not adopt. The conventions live in `docs/AGENTS.md` and the per-folder schemas. docs-store stays where it is.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because the first records in this repo follow the rules written for it.
- Bad, because rationale that exists only in docs-store is not in this tree until someone writes a new decision here.
