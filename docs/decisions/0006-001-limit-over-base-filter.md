---
status: accepted
date: 2026-11-03
---

# Prefer limit=1000 over base-currency filter refetch

## Context and Problem Statement

COST-8565 needs the create exchange rate modal to see every currency’s `static_rates` for overlap validation, including disabled currencies. The ticket suggests refetching `settings/currency/` filtered by the base currency being configured. An alternative is one dedicated fetch of the full list with a high limit.

## Considered Options

- On modal open / base-currency change, request `settings/currency/` filtered to that base currency
- Give `AddRate` its own fetch with `limit=1000` plus `offset` / `order_by` (duplicate request beside dropdowns)
- Reuse `useCurrencySettings` (`limit=1000`, no `enabled`) for create-flow overlap in `RateContent`

## Decision Outcome

Chosen option: **reuse `useCurrencySettings`**. Overlap checks need the full catalog (including disabled currencies). The currency dropdowns already fetch that list; sharing the Redux query string avoids a second nearly identical HTTP call. The table’s paginated `limit=10` query remains a separate cache entry.

Related plan: [0006-add-rate-currency-fetch.md](../plans/0006-add-rate-currency-fetch.md).

### Consequences

- Good, because create validation no longer depends on table pagination, the “show disabled” toggle, or the currently selected base.
- Good, because dropdowns and overlap share one network request.
- Neutral, because currency count today is modest (~150); a much larger catalog would revisit pagination or filtering.
- Neutral, because remounting the create modal re-runs the shared hook effect and refreshes the list after prior mutations.
