---
date: 2026-11-03
plan: ../plans/0006-add-rate-currency-fetch.md
---

# AddRate currency list for overlap validation

## Context

Creating a static exchange rate validates date-range overlaps against existing `static_rates` on the currency settings list. That list was the parent Exchange Rates table page (`limit=10`), so base currencies past page 1 never contributed rates to the check. Users could create overlapping rates for those currencies with no alert ([COST-8565](https://redhat.atlassian.net/browse/COST-8565)).

## Requirements

- The create exchange rate flow has a complete enabled-currency settings payload (including `static_rates`) for overlap validation, independent of table pagination.
- `AddRate` owns that fetch via its own `useMapToProps`; the toolbar no longer supplies the paginated table `settings` for the modal.
- The table continues to use its own paginated `limit=10` query; the two Redux cache keys stay separate.
- Edit and duplicate flows are unchanged for this effort.

## Considered options

- Refetch `settings/currency/` filtered by the selected base currency when the create modal opens or the base field changes (ticket suggestion).
- Give `AddRate` a dedicated `useMapToProps` with `limit=1000` for the full enabled list (chosen; see decision).

## Outcome

`AddRate` fetches enabled currencies with `limit=1000` and passes `settings.data` into `AddRateModal` / `RateContent` for `findOverlappingRate`. Create-modal overlap checks no longer depend on which page of the settings table is loaded.
