---
date: 2026-11-03
spec: ../specs/0004-preserve-expand-pagination.md
---

# Preserve pagination and expand state (COST-8568)

## Problem

On Settings → Exchange rates, add/duplicate/delete of a static rate jumps to page 1 and collapses expanded rows ([COST-8568](https://redhat.atlassian.net/browse/COST-8568)). Tag mapping already keeps the page; expand still collapses for the same shared reason.

## Root causes

1. **Pagination (exchange rates only):** [`handleOnAdd` / `handleOnDelete` / `handleOnDuplicate`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.tsx) call `handleOnSetPage(1)` before `forceUpdate()`. Edit already only force-refetches.
2. **Expand collapse (both):** Shared [`ExpandTable`](../../apps/koku-ui-hccm/src/routes/components/dataTable/expandTable.tsx) stores `expandedRows` as a `Set` of **object references**. Parents also **unmount** the table for a full-page `LoadingState` on every refetch, wiping that Set. New API objects would not match the Set even if the component stayed mounted.
3. **Expand icon after last static rate deleted:** Expected — [`exchangeRateTable`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx) only sets `children` when `static_rates.length > 0`. No change.

## Approach (minimum change)

`ExpandTable` already supports in-table loading via `isLoading` (spinner row, component stays mounted). Parents already pass `isLoading` into the table components but discard that path by swapping to `LoadingState`.

### 1. `ExpandTable` — stable expand keys

In [`expandTable.tsx`](../../apps/koku-ui-hccm/src/routes/components/dataTable/expandTable.tsx):

- Derive a stable key: `item?.uuid ?? item?.code ?? item?.id ?? item`
- Store those keys in `expandedRows`
- Use the same helper in `handleOnToggle` and `isExpanded`
- Copy the Set on toggle (match `compoundExpandTable`; avoid mutating state in place)

No new props. Currency parents use `code`; tag-mapping parents use `uuid`. Existing tests that use `{ id: 'a' }` keep working via `id`.

### 2. Keep tables mounted on refetch

**Exchange rates** — [`exchangeRate.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.tsx):

- Show full-page `LoadingState` only on **initial** load (`isLoading && !settings`)
- After data exists, always render toolbar/table/pagination and pass `isLoading` through

**Tag mapping** — [`tagMapping.tsx`](../../apps/koku-ui-hccm/src/routes/settings/tagLabels/tagMapping/tagMapping.tsx):

- Same pattern: full-page `LoadingState` only when fetching and `settings` is still missing
- Otherwise keep `TagMappingTable` mounted with its existing `isLoading` prop

### 3. Stop resetting exchange-rate page on static-rate mutations

In [`exchangeRate.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.tsx):

- `handleOnAdd` / `handleOnDelete` / `handleOnDuplicate`: `forceUpdate()` only (same as edit and tag mapping)
- Keep `handleOnSetPage(1)` for **enable/disable** and **show disabled** — those change which currencies appear in the paginated list

### Out of scope

- `CompoundExpandTable` (same object-identity pattern; not used by these screens)
- Clamping page after deletes leave an empty page (tag mapping already accepts this)
- Changing when the expand icon appears

## Tests

- [`expandTable.test.tsx`](../../apps/koku-ui-hccm/src/routes/components/dataTable/expandTable.test.tsx): expand a row, rerender with a **new** `item` object that shares `uuid`/`code`/`id`, assert still expanded; assert loading spinner does not clear that behavior after load ends
- Exchange rate handlers: add/delete/duplicate no longer force page 1
