---
date: 2026-11-03
plan: ../plans/0004-sgd-exchange-rate-format.md
---

# SGD exchange rate formatting

## Context

Exchange rates and price-list rates format currency amounts through shared helpers in `apps/koku-ui-hccm/src/utils/format.ts`. Singapore Dollar is special-cased with `formatSGD` so the UI shows `S$` instead of ICU’s ambiguous `$` or the code `SGD`. QE found that SGD rates in Settings → Exchange rates render with a space (`S$ 2`) in the nested table, and that edit/duplicate prefill puts `S$2` into the Exchange rate input, which fails numeric validation.

## Requirements

- Display formatting for SGD amounts uses `S$` immediately before the number with no NBSP or space (for example `S$2`), consistent with compact symbols such as `CA$2` and `A$2`.
- Raw/input formatting for SGD returns a locale-formatted numeric string only (for example `2`), with no currency code or `S$` symbol, so edit and duplicate forms remain valid.
- `getCurrencySymbol('SGD')` continues to return `S$`.
- Non-SGD currencies keep their existing display and raw behavior.

## Considered options

- Force `narrowSymbol` for SGD and let `formatSGD` turn `$` into `S$`; skip `formatSGD` on the `currencyDisplay: 'code'` raw path so code stripping still works. Chosen.
- Strip `S$` after `formatSGD` inside `formatCurrencyRaw` only. Rejected as a symptom fix that leaves the spaced display path broken unless duplicated.
- Change exchange-rate table or `rateContent` call sites. Rejected; the helpers already distinguish display vs raw.

## Outcome

`shouldUseNarrowSymbol` treats SGD as narrow-eligible because `formatSGD` disambiguates `$` to `S$`. `formatCurrency` applies `formatSGD` for SGD display only and skips it when `currencyDisplay` is `code`, so `formatCurrencyRaw` / `formatCurrencyRateRaw` strip `SGD` and leave a numeric string.
