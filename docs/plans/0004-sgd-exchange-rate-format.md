---
date: 2026-11-03
spec: ../specs/0004-sgd-exchange-rate-format.md
---

# Fix SGD exchange rate formatting

## Context

QE found two SGD-only bugs on Exchange rates (AED → SGD):

1. Inner table shows `S$ 2` (NBSP between symbol and value).
2. Edit/duplicate prefill shows `S$2` in the Exchange rate input (symbol must not appear; validation rejects it).

Both come from [`apps/koku-ui-hccm/src/utils/format.ts`](../../apps/koku-ui-hccm/src/utils/format.ts). Call sites are already correct conceptually:

- Table display: `formatCurrencyRate` in [`exchangeRateTable.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx)
- Form prefill: `formatCurrencyRateRaw` in [`rateContent.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/components/rateContent.tsx)

## Root cause

`shouldUseNarrowSymbol('SGD')` is false because ICU narrow SGD is `$` (same as USD). Default symbol/code formatting yields `SGD\u00a02`. Then `formatSGD` rewrites `SGD` → `S$` and **keeps the NBSP** → `S$\u00a02` (looks like `S$ 2`).

`formatCurrencyRaw` asks for `currencyDisplay: 'code'`, then strips the code. Because `formatSGD` already ran, `.replace('SGD', '')` no-ops and only the NBSP is removed → `S$2`.

USD/CAD/AUD/EUR are unaffected. Verified locally with ICU `en`.

## Fix (single file + tests)

In [`format.ts`](../../apps/koku-ui-hccm/src/utils/format.ts):

1. **Display:** Treat SGD as eligible for `narrowSymbol` in `shouldUseNarrowSymbol` (comment: `formatSGD` disambiguates `$` → `S$`). Pipeline becomes `$2` → `formatSGD` → `S$2` (no NBSP), matching `CA$2` / `A$2`.
2. **Raw/input:** In `formatCurrency`, skip `formatSGD` when `currencyDisplay === 'code'` (as passed by `formatCurrencyRaw`). Stripping then sees `SGD` and yields a numeric string like `2`.

No exchange-rate UI changes. Same helpers fix price-list SGD display/input if used.

## Tests

Extend [`format.more.test.ts`](../../apps/koku-ui-hccm/src/utils/format.more.test.ts):

- `formatCurrency` / `formatCurrencyRate(2, 'SGD')` → `S$2` (no NBSP / space)
- `formatCurrencyRaw` / `formatCurrencyRateRaw(2, 'SGD')` → `2` (no `S$`)
- `getCurrencySymbol('SGD')` still `S$`

## Out of scope

- No modal or table markup changes
- No decision doc (clear bugfix; no rejected alternative)
