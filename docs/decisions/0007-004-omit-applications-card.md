---
status: accepted
date: 2026-11-04
---

# Omit the Applications card

## Context and Problem Statement

The Applications card switch and kebab call `pauseApplication` and `deleteApplication`. On-prem those calls reject. Pause and remove for these records are `pauseSource` / source delete. The card can be replaced with disabled controls, replaced by editing the upstream detail layout, or rendered as nothing.

## Considered Options

- A card with the switch and kebab disabled
- A `Detail.js` shim that removes the Applications column and lets the summary span the row
- A null `ApplicationsCard` shim, leaving the upstream `GridItem md="6"` in place

## Decision Outcome

Chosen option: **a null ApplicationsCard**. The column stays, so the summary keeps the half-width layout used on SaaS. Disabled controls were an intermediate step and were removed. The detail-page shim was removed for the same reason.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because the detail grid matches SaaS, with an empty right column.
- Neutral, because application-level Pause and Remove are not on this page. They remain on the integration row.
