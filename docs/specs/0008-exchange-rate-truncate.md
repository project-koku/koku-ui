---
date: 2026-11-10
plan: ../plans/0008-exchange-rate-truncate.md
---

# Exchange rate precision in table vs dialog

## Context

Exchange rates may store up to 15 decimal places. Shared formatters (`formatCurrencyRate` / `formatCurrencyRateRaw`) default to 10 fraction digits for cost models. The add/edit dialog must show the full stored rate. The nested static-rate table has limited column space, so long values need a compact presentation without permanently discarding digits.

## Requirements

- Add, edit, and duplicate rate dialogs display up to 15 decimal places in the rate input.
- The exchange rate table shows the full formatted rate string for tooltip recovery.
- The rate cell remains compact under typical column width (ellipsis when overflowed).
- Cost-model and price-list rate formatting stay at their existing 10-decimal default.

## Considered options

- Cap the table cell with `maximumFractionDigits: 10` and leave the dialog at 15.
- Format the table cell with up to 15 decimals and wrap it in PatternFly `Truncate` so width overflow ellipsizes and hover shows the full value.

## Outcome

Use PatternFly `Truncate` in the exchange rate table cell with a 15-decimal formatted string and a constrained rate column width. Keep dialog prefill at 15 decimals. Do not change shared formatter defaults used by cost models.
