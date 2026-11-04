---
date: 2026-11-03
plan: ../plans/0006-add-rate-currency-fetch.md
---

# AddRate currency list for overlap validation

## Context

Creating a static exchange rate validates date-range overlaps against existing `static_rates` on the currency settings list. That list was the parent Exchange Rates table page (`limit=10`), so base currencies past page 1 never contributed rates to the check. Users could create overlapping rates for those currencies with no alert ([COST-8565](https://redhat.atlassian.net/browse/COST-8565)).

## Requirements

- The create exchange rate flow has a complete currency settings payload (including disabled currencies and their `static_rates`) for overlap validation, independent of table pagination and the “show disabled” toggle.
- Dropdown options and overlap validation share one `settings/currency/?limit=1000` request (same Redux query string as `useCurrencySettings`).
- The table continues to use its own paginated `limit=10` query; that cache key stays separate.
- Edit and duplicate flows still receive table `settings` for the edited row.

## Considered options

- Refetch `settings/currency/` filtered by the selected base currency when the create modal opens or the base field changes (ticket suggestion).
- Give `AddRate` a dedicated fetch with a different query string (`offset` / `order_by`), causing a duplicate request beside the dropdowns.
- Reuse `useCurrencySettings` (`limit=1000`, no `enabled`) for create-flow overlap in `RateContent` (chosen; see decision).

## Outcome

Create-modal overlap checks use the same `useCurrencySettings` cache as the currency dropdowns. One `limit=1000` request serves both. Validation no longer depends on which page of the settings table is loaded.
