---
status: accepted
date: 2026-11-03
---

# Prefer limit=1000 over base-currency filter refetch

## Context and Problem Statement

COST-8565 needs the create exchange rate modal to see every currency’s `static_rates` for overlap validation, including disabled currencies. The ticket suggests refetching `settings/currency/` filtered by the base currency being configured. An alternative is one dedicated fetch of the full list with a high limit.

## Considered Options

- On modal open / base-currency change, request `settings/currency/` filtered to that base currency
- Give `AddRate` its own `useMapToProps` with `filter[enabled]=true`, `limit=1000` (enabled currencies only)
- Give `AddRate` its own `useMapToProps` with `limit=1000` and no `filter[enabled]`, matching the table’s “show disabled” all-currencies query

## Decision Outcome

Chosen option: **`AddRate` owns a `limit=1000` fetch with no `enabled` filter**. Overlap checks need rates nested under either currency in the pair, including rates on disabled currencies; omitting `enabled` matches the toolbar’s “show disabled” query and returns the full catalog. Redux already separates cache by query string from the table’s default `limit=10` + `enabled=true` page. The same high-limit pattern exists in price-list fetch helpers.

Related plan: [0006-add-rate-currency-fetch.md](../plans/0006-add-rate-currency-fetch.md).

### Consequences

- Good, because create validation no longer depends on table pagination, the “show disabled” toggle, or the currently selected base.
- Good, because implementation mirrors existing `useMapToProps` / `limit=1000` patterns and the table’s all-currencies query shape.
- Neutral, because currency count today is modest (~150); a much larger catalog would revisit pagination or filtering.
- Neutral, because the fetch runs when the create modal opens, not on every page mount.
