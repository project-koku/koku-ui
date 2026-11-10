---
date: 2026-11-10
spec: ../specs/0008-exchange-rate-truncate.md
decisions:
  - ../decisions/0008-001-truncate-over-format-cap.md
---

# Exchange rate table Truncate preview

## Goal

- Add/edit/duplicate dialogs keep full precision (up to 15 decimals) — already done in [`rateContent.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/components/rateContent.tsx).
- Table stays compact: show the full formatted rate inside PatternFly `Truncate` so overflow ellipsizes and hover shows the complete value.
- Reject format-only truncation to 10 decimals in the table (that drops digits with no tooltip recovery).

## Why Truncate (not `maximumFractionDigits: 10`)

`formatCurrencyRate` defaults to 10 fraction digits for cost models. Using that in the exchange-rate table would hide digits 11–15 permanently in the cell. `Truncate` keeps the full string for the tooltip while letting the cell respect limited width (PF’s default width-observing behavior, same idea as their resizable demo container).

Existing in-repo pattern: [`gpuTable.tsx`](../../apps/koku-ui-hccm/src/routes/details/components/gpuData/gpuTable.tsx) uses `<Truncate content={...} />` in table cells.

## Implementation

1. **[`exchangeRateTable.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx)**
   - Keep formatting with `maximumFractionDigits: 15`.
   - Set the rate cell `value` to `<Truncate content={formattedRate} />` (default end truncation; tooltip from Truncate).
   - Apply a rate-column cell style with `maxWidth` (and `minWidth: 0` if needed) so the nested static-rate `DataTable` cell actually constrains width; without that, the column can grow and Truncate never activates.

2. **[`exchangeRateTable.styles.ts`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.styles.ts)**
   - Add something like `rateColumn: { maxWidth: '8rem', minWidth: 0 }` (tune after visual check) and attach it on the rate cell.

3. **Dialog**
   - Leave [`rateContent.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/components/rateContent.tsx) `formatCurrencyRateRaw(..., { maximumFractionDigits: 15 })` as-is.

4. **Tests**
   - Update [`exchangeRateTable.test.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.test.tsx): high-precision case should assert Truncate receives the full formatted string (or that full text is present / tooltip content), not that the visible cell equals the untruncated string alone.
   - Keep the rateContent 15-decimal prefill test.

5. **Visual check (for you to evaluate)**
   - After implementation, open Exchange rates with a static rate such as `0.123456789012346`, expand the row, and confirm the rate cell ellipsizes and the Truncate tooltip shows the full value. Adjust `maxWidth` if truncation is too aggressive or never triggers.

## Out of scope

- Changing cost-model / price-list `formatCurrencyRate` defaults (stay at 10).
- Backend float rounding (`0.123456789012345` → `0.123456789012346`).
