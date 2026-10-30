# Agent instructions — `docs/decisions`

One architecture decision per file, in [MADR 4 minimal](https://github.com/adr/madr/blob/4.0.0/template/adr-template-minimal.md) form.

## When to write

Write a decision only when a real alternative was rejected, for a reason a later session would otherwise redo. One fork, one file.

Do not write a decision that only restates the plan or the spec. Options already listed in a spec do not become a decision by themselves. A plan with no such fork gets no decision.

A decision may be written in the same turn as a plan, or later, when implementation or a follow-up rejects an alternative.

## New decision

1. Use the related plan or RFE's `NNNN`. `MMM` is the highest sub-counter already used for that `NNNN`, plus 1, starting at `001`. A decision that supersedes another decision for the same effort keeps `NNNN` and takes the next `MMM`.
2. Filename: `NNNN-MMM-<short-kebab-topic>.md`.
3. Required YAML frontmatter:

| Field | Required | Description |
|-------|----------|-------------|
| `status` | yes | `accepted`, `deprecated`, or `superseded` |
| `date` | yes | `YYYY-MM-DD` |
| `supersedes` | no | Filename this decision replaces, e.g. `0001-001-empty-docs-tree.md` |
| `superseded-by` | no | On the old file: filename of the decision that replaced it |

`status` records whether the decision still holds. It is not Jira workflow status.

4. H1 is a short title. Do not put the numeric id in the heading.
5. Body, in order:
   - `## Context and Problem Statement`
   - `## Considered Options`
   - `## Decision Outcome` — name the chosen option and why
   - `### Consequences` — optional
6. Link the related plan. Do not put task lists or implementation state here.

## When a decision changes

- Before implementation, if the decision was written in the same unshipped pass and the approved plan changes that choice, edit the decision in place.
- After acceptance, if a later choice reverses it, leave the original outcome as written. Set the old file to `status: superseded` and `superseded-by`. Add a new decision with `status: accepted` and `supersedes`.
- In-place edits after acceptance are clarifications that do not change what was decided.
- Do not change `NNNN` or `MMM` after the file exists.
