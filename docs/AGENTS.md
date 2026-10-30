# Agent instructions — `docs/`

This tree records plans, specs, RFEs, and decisions for this repo. Jira tracks ticket status and QA. Do not add a status field to RFEs, specs, or plans, and do not add an index.

## Folders

| Folder | Role |
|--------|------|
| [`plans/`](plans/AGENTS.md) | The Cursor plan, saved as written |
| [`specs/`](specs/AGENTS.md) | What and why, paired with a plan |
| [`rfes/`](rfes/AGENTS.md) | A proposal that is not being planned yet |
| [`decisions/`](decisions/AGENTS.md) | One choice, only when a real alternative was rejected |

## Ids

The leading four digits are the effort. A plan, its spec, and every decision or RFE for that effort share `NNNN`. Plans, specs, and RFEs are `NNNN-<slug>.md`. Decisions are `NNNN-MMM-<slug>.md`. `MMM` is a three-digit sequence for that effort, starting at `001`. The sub-counter is only the second group on a decision filename. Do not treat it as an effort id.

A new effort takes the highest leading `NNNN` in any folder, plus 1. Ignore `AGENTS.md`. Do not hardcode the next id here. Files added later for that effort reuse its number. An unplanned RFE is a new effort. A plan written later for that RFE uses the RFE's number.

A plan and the spec written together also share the same kebab slug. The next decision for an effort uses the highest `MMM` already used with that `NNNN`, plus 1.

The effort id lives in the filename. Decision and spec titles do not repeat it. An RFE title is `# RFE-NNNN: …`, and that number matches the filename.
