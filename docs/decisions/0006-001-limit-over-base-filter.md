---
status: accepted
date: 2026-11-03
---

# Prefer limit=1000 over base-currency filter refetch

## Context and Problem Statement

COST-8565 needs the create exchange rate modal to see every enabled currency’s `static_rates` for overlap validation. The ticket suggests refetching `settings/currency/` filtered by the base currency being configured. An alternative is one dedicated fetch of the full enabled list with a high limit.

## Considered Options

- On modal open / base-currency change, request `settings/currency/` filtered to that base currency
- Give `AddRate` its own `useMapToProps` with `filter[enabled]=true`, `limit=1000`, matching the table query shape except page size

## Decision Outcome

Chosen option: **`AddRate` owns a `limit=1000` fetch**. Overlap checks need rates nested under either currency in the pair; a single full enabled list covers every base without timing fetches to field changes. Redux already separates cache by query string from the table’s `limit=10` page. The same high-limit pattern exists in price-list fetch helpers.

Related plan: [0006-add-rate-currency-fetch.md](../plans/0006-add-rate-currency-fetch.md).

### Consequences

- Good, because create validation no longer depends on table pagination or the currently selected base.
- Good, because implementation mirrors existing `useMapToProps` / `limit=1000` patterns.
- Neutral, because currency count today is small; a much larger catalog would revisit pagination or filtering.
- Bad, because the page loads an extra currency request when `AddRate` mounts, even if the user never opens create.
