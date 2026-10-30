---
date: 2026-10-30
spec: ../specs/0001-repo-docs-tracker.md
decisions:
  - ../decisions/0001-001-empty-docs-tree.md
  - ../decisions/0001-002-save-every-nontrivial-plan.md
  - ../decisions/0001-003-decisions-only-on-a-fork.md
  - ../decisions/0001-004-rfes-only-for-unplanned-proposals.md
  - ../decisions/0001-005-group-related-files-by-counter.md
  - ../decisions/0001-006-decision-sub-counter.md
---

# In-repo docs tracker

Adopt the docs-store layout inside koku-ui. Leave docs-store untouched and copy none of its records. Jira remains the tracker for ticket status and QA.

## Layout

```
docs/
  AGENTS.md
  decisions/AGENTS.md
  rfes/AGENTS.md
  specs/AGENTS.md
  plans/AGENTS.md
```

Each `AGENTS.md` is the schema for that folder. Git tracks the folders because of those files. There is no index and no status field on RFEs, specs, or plans.

The leading four digits are the effort. A plan, its spec, and every decision or RFE for that effort share `NNNN`. Plans, specs, and RFEs are `NNNN-<slug>.md`. Decisions are `NNNN-MMM-<slug>.md`. `MMM` is a three-digit sequence for that effort, starting at `001`. Do not treat the sub-counter as an effort id. A new effort takes the highest leading `NNNN` in any folder, plus 1. The next decision for an effort uses the highest `MMM` for that `NNNN`, plus 1. Do not hardcode the next id in the instructions.

## What each folder is for

- **`docs/plans/`** — the Cursor plan, saved as written. Filename `NNNN-<kebab-topic>.md`. H1 is the plan title. Frontmatter is `date` plus a relative link to the sibling spec, and to any RFE or decisions that point at this plan. No execution-skill banner, no status.
- **`docs/specs/`** — design intent: context, requirements, considered options, outcome. Link a paired plan when both exist. Same numeric id as the plan when they are created together.
- **`docs/rfes/`** — a proposal that is not being planned yet: problem, goal, and proposed direction. H1 is `# RFE-NNNN: Title`. Include a Jira link when the user gave one. Written when the user asks to capture an enhancement and does not ask for a plan. Implementation steps belong in a plan, not here. If that proposal is planned later, add a plan and spec and link them to this RFE.
- **`docs/decisions/`** — one choice per file, MADR 4 minimal: context, considered options, outcome, optional consequences. Written only when a real alternative was rejected, for a reason a later session would otherwise redo. Options already listed in the spec do not become a decision by themselves. Keep `status` (`accepted`, `deprecated`, `superseded`) and `supersedes` / `superseded-by` so a later decision can replace an earlier one. That is decision history, not Jira workflow status.

`docs/AGENTS.md` is a short map of the four folders and those rules. Do not add this to the UI-scoped root `AGENTS.md`.

## When a plan is saved

`.cursor/rules/repo-docs.mdc` has `alwaysApply: true`. It tells the agent:

- When it creates a Cursor plan for a non-trivial change (Plan mode, or any multi-step plan), write two files in the same turn, sharing `NNNN` and slug:
  - `docs/plans/NNNN-slug.md` — the Cursor plan, unchanged
  - `docs/specs/NNNN-slug.md` — what and why, distilled from the plan. Requirements and outcome, not the task list
- In that same turn, write a decision only for a fork where another real option was rejected. One fork, one file, named `NNNN-MMM-<slug>.md` with that plan's `NNNN` and the next `MMM`, MADR form, `status: accepted`, with a link to the plan. A plan that has no such fork gets no decision.
- Do not write an RFE for a plan. Write an RFE only when the user asks to capture a proposal and is not asking for a plan. If a plan later covers an existing RFE, link the plan and spec to it.
- The spec and any decisions link to the plan. Follow that folder's `AGENTS.md` for the body.
- A one-step edit that never becomes a plan does not get files.
- If the user edits the plan before implementation, overwrite the plan file with the approved text at the start of implementation, and update the spec when the destination changed. Update a decision written in that same unshipped pass when its choice changed. Add a decision if the edit introduces a new fork.
- Implementing the plan does not create a second spec or plan.
- If implementation, or a later change, rejects a real alternative, add a new decision with the plan's `NNNN`, the next `MMM`, and a link to the plan. If that choice reverses an accepted decision, leave the original outcome as written, set it to `status: superseded` and `superseded-by` (the new filename), and set `supersedes` on the new file to the old filename. In-place edits after acceptance are clarifications that do not change what was decided.

No new skills. The rule is always loaded, so saving does not depend on a skill being selected. The folder `AGENTS.md` files are the templates.
