---
date: 2026-11-03
plan: ../plans/0005-disabled-currency-fallback.md
---

# Disabled currency session fallback

## Context

Cost Management lets users pick a display currency for report APIs and store it in sessionStorage. Separately, Settings → Exchange rates can disable currencies. Disabling the currency that is still selected in sessionStorage leaves overview, details, explorer, and other report pages calling APIs with an invalid `currency=` value, which surfaces as a full-page error.

## Requirements

- When a user disables the currency that matches the current session display currency, the session currency is reset to the account default currency before they leave Exchange rates.
- If a page loads with a session currency that is no longer in the enabled `GET currency/` list, the UI resets to the account default and refreshes report queries via the existing currency `onSelect` path.
- After enable or disable completes, the global currency dropdown list is refetched so disabled codes no longer appear as selectable options.
- Account default currency remains the fallback (with its existing `USD` default when unset). Hardcoding `'USD'` in the disable path is not the destination.

## Considered options

- Reset session currency to hardcoded `USD` on disable. Rejected; account default is the product seed and cannot be disabled.
- Reset only on disable, with no Currency guard and no `GET currency/` refetch. Rejected; stale sessions and a stale dropdown remain possible.
- Reset to account default on disable, recover in Currency when options omit the selection, and refetch `GET currency/` after enable/disable. Chosen.

## Outcome

Disable of the active session currency writes the account default into sessionStorage. The Currency selector recovers if the stored code is missing from enabled options. `useCurrency` refetches after enable/disable so dropdown options stay aligned with Exchange rates.
