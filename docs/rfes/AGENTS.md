# Agent instructions — `docs/rfes`

Proposals that are not being planned yet.

## When to write

Write an RFE when the user asks to capture an enhancement and does not ask for a plan. Do not write an RFE for a Cursor plan. A plan and its spec stand on their own.

If a plan later covers an existing RFE, link the plan and spec to this file. Leave the RFE in place.

## New RFE

1. An unplanned RFE is a new effort. Take the next `NNNN` from [`../AGENTS.md`](../AGENTS.md). A later plan and spec for this RFE use this number.
2. Filename: `NNNN-<short-kebab-topic>.md`.
3. H1: `# RFE-NNNN: <Title>`. The number matches the filename.
4. Include a Jira link when the user gave one.
5. Body: problem, goal, and proposed direction. Implementation steps belong in a plan, not here.
6. There is no status field.
