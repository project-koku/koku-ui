---
date: 2026-10-30
plan: ../plans/0001-repo-docs-tracker.md
---

# Repo docs tracker

## Context

Cursor plans stay in the chat unless something copies them into the repo. This repo needs a place for those plans, the design they describe, proposals that are not yet planned, and choices that rejected a real alternative.

[docs-store](https://github.com/jkilzi/docs-store) is the example for the folder layout. It is not a submodule, and its records are not copied here. Jira remains the tracker for ticket status and QA.

## Requirements

- `docs/plans/`, `docs/specs/`, `docs/rfes/`, and `docs/decisions/`, each with an `AGENTS.md` schema. `docs/AGENTS.md` maps the folders and the shared id rule.
- A non-trivial Cursor plan writes `docs/plans/NNNN-<slug>.md` and `docs/specs/NNNN-<slug>.md` in the same turn. The plan is saved as written. The spec states the destination.
- An RFE is written only when the user asks to capture a proposal and is not asking for a plan.
- A decision is written only when a real alternative was rejected. One fork, one file, in MADR 4 minimal form.
- The leading four digits are the effort. Plans, specs, and RFEs are `NNNN-<slug>.md`. Decisions are `NNNN-MMM-<slug>.md`, with `MMM` starting at `001` for that effort.
- No status field on RFEs, specs, or plans. No index. No new skill. An always-on rule, `.cursor/rules/repo-docs.mdc`, tells the agent when to write.
- The UI-scoped root `AGENTS.md` is left unchanged.

## Considered options

- Copy docs-store into this tree, or copy only its decisions and specs. Rejected. See [0001-001-empty-docs-tree.md](../decisions/0001-001-empty-docs-tree.md).
- Save a plan only when asked. Rejected. See [0001-002-save-every-nontrivial-plan.md](../decisions/0001-002-save-every-nontrivial-plan.md).
- Write a decision with every plan. Rejected. See [0001-003-decisions-only-on-a-fork.md](../decisions/0001-003-decisions-only-on-a-fork.md).
- Write an RFE with every plan, or only from a Jira issue. Rejected. See [0001-004-rfes-only-for-unplanned-proposals.md](../decisions/0001-004-rfes-only-for-unplanned-proposals.md).
- Give every file its own number. Rejected. See [0001-005-group-related-files-by-counter.md](../decisions/0001-005-group-related-files-by-counter.md).
- Distinguish decisions by slug alone. Rejected. See [0001-006-decision-sub-counter.md](../decisions/0001-006-decision-sub-counter.md).

## Outcome

The tree starts empty of historical records. Each non-trivial Cursor plan is stored with a spec. RFEs and decisions are separate files, written only for the cases above, and they link back to the plan they concern.
