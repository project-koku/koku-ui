---
status: accepted
date: 2026-10-30
---

# Group related files by the same counter

## Context and Problem Statement

Plans and specs for one effort share `0001` and the same slug. Decisions for that effort were given later numbers (`0002`, `0003`, and so on). Listing `docs/decisions/` did not show which plan those files belonged to. The link was only in frontmatter and a line inside each file.

How should a decision be numbered relative to its plan?

## Considered Options

- Give every file the next free number, and relate it to the plan only by a link
- Use the plan's counter for every decision and RFE that belongs to that effort, and keep each file distinct by its slug

## Decision Outcome

Chosen option: **use the effort's counter for every related file**. The number is the effort. The slug is the file. A plan, its spec, and every decision or RFE for that effort share `NNNN`. Filenames stay unique inside a folder because the slugs differ.

A new effort takes the highest `NNNN` in any folder, plus 1. A decision added later for the same plan reuses that plan's number and uses a new slug. `supersedes` and `superseded-by` store the filename, because the number alone is no longer unique.

Related plan: [0001-repo-docs-tracker.md](../plans/0001-repo-docs-tracker.md).

### Consequences

- Good, because every file for an effort sorts together by prefix.
- Bad, because a number such as `0001` appears on more than one file, so a reference has to include the slug.
