---
date: 2026-11-03
plan: ../plans/0004-preserve-expand-pagination.md
---

# Preserve pagination and expand state

## Context

Settings → Exchange rates resets to page 1 and collapses expanded static-rate rows after add, duplicate, or delete ([COST-8568](https://redhat.atlassian.net/browse/COST-8568)). Map tags and labels already keeps the current page on mutation, but expanded rows collapse for the same shared `ExpandTable` reasons: object-identity expand keys and a full-page loading swap that unmounts the table.

## Requirements

- After add, duplicate, or delete of a static rate, stay on the current exchange-rates page.
- Enable/disable and the show-disabled toggle may still reset to page 1 (list membership changes).
- Expanded parent rows stay expanded across refetch for exchange rates and tag mapping when the parent still has children.
- When a currency has no remaining static rates, the expand control is omitted (existing behavior).
- Behavior is consistent between exchange rates and tag mapping for expand preservation.

## Considered options

- Fix pagination only and accept expand collapse. Rejected: the ticket and parity with tag mapping call for expand as well.
- Lift expand state into each page. Rejected: larger surface; shared `ExpandTable` can keep state with stable keys and staying mounted.
- Stable expand keys plus keep `ExpandTable` mounted on refetch (use its existing `isLoading` spinner). Chosen: minimum shared change covering both screens.

## Outcome

Exchange-rate static-rate mutations keep the current page. `ExpandTable` keys expand state by `uuid` / `code` / `id`, and both settings pages keep the table mounted after the first load so expand state survives refetch.
