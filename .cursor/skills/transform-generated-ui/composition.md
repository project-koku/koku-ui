# Composition

Folder shape is in [organization.md](organization.md). This file is how the code inside those files is written.

Before writing a page, a table, or an action, open one of each and match this layout. Use these files:

- `apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.tsx`
- `apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx`
- `apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/components/add/addRate.tsx`

`apps/koku-ui-hccm/src/routes/settings/priceLists/priceList/priceList.tsx` is the same page shape. Do not copy those directory or file names. Name folders for the feature being transformed.

Keep the prototype's screens, empty states, filtered-empty states, and read-only behavior. Do not keep its component boundaries or which component owns state.

## Page

The page is an orchestrator. It owns query state and the loading / error / empty branch. It does not also own search text, sort, pagination math, cell rendering, or every modal.

Order inside the component:

1. `baseQuery` (`limit`, `offset`, `filter_by`, `order_by`) and `useState` for that query.
2. `useMapToProps({ query })`. Until an API exists, that function returns fixtures. See [data.md](data.md).
3. `hasFilters`, `hasNoItems`, and `isLoading`.
4. `get*` functions that return the toolbar, the table, and pagination.
5. A `// Handlers` block. Names are `handleOnFilterAdded`, `handleOnFilterRemoved`, `handleOnPerPageSelect`, `handleOnSetPage`, `handleOnSort`, and `handleOn*` for each mutation. Filter, page, per-page, and sort go through `routes/utils/query`.
6. The return: error (`NotAvailable`), then loading, then the no-data empty state, otherwise the card with toolbar and table. When filters match nothing, keep the toolbar and let the table show the empty-filter state.
7. `useMapToProps` at the bottom of the file.

```tsx
const getTable = () => (
  <ItemTable
    canWrite={canWrite}
    filterBy={query.filter_by}
    isLoading={isLoading}
    items={items}
    onDelete={handleOnDelete}
    onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
    orderBy={query.order_by}
  />
);

// Handlers

const handleOnFilterAdded = filter => {
  setQuery(queryUtils.handleOnFilterAdded(query, filter));
};
```

Pagination is PatternFly `Pagination`, top and bottom, built by `getPagination`. Aria titles use the shared pagination message.

## Table

A settings list is `DataTable` or `ExpandTable` from `routes/components/dataTable`. Import `routes/components/dataTable/dataTable.scss`.

`initDatum` builds `columns` and `rows`. A column has `name`, and `orderBy` plus `isSortable` when the page can sort it. A cell is `{ value }`. An actions cell sets `isActionsCell: true` and renders the action component as `value`. Call `initDatum` from `useEffect` when the rows or `intl` change.

Do not hand-write `Table`, `Thead`, and `Tbody` for a settings list. Do not put a second filter, sort, or page state machine in the table. The page query is that state. Pass `filterBy`, `orderBy`, `onSort`, and `isLoading` through.

Expandable detail is a child `DataTable` assigned to the row's `children`, the way the exchange-rate table nests static rates.

## Toolbar

The toolbar is a thin wrapper around `BasicToolbar`. Category options and the actions node are `get*` functions in that file. The page passes `query`, pagination, `onFilterAdded`, and `onFilterRemoved`.

Write actions are a component from `components/<action>/`, rendered inside the toolbar actions. They are not a `Button` whose click handler lives on the page.

## Actions

One folder per action. The action component owns `isOpen` and its modal.

A toolbar button follows `addRate.tsx`: local `isAddModalOpen`, `handleOnAddModalClick`, `handleOnAddModalClose`, `handleOnAddModalAdd`, then the modal and the button in the same return.

A kebab follows the same split. `DropdownWrapper` items call into the edit, duplicate, and delete components. Those components own the modal. `toString` returns `intl.formatMessage(...)`. Read-only items set `isDisabled` and `tooltipProps` with `messages.readOnlyPermissions`.

The page receives `onAdd`, `onEdit`, and `onDelete`. It does not render those modals itself because the prototype kept one modal on the page.

When the same modal is used before an API exists and again after one does, take `isDispatch` (default `true`). `isDispatch` false calls the parent callback. The transform leaves the callback path in place and does not add the dispatch.

## Logic

Pure calculations live in that feature's `utils`, not in a chain of `useMemo` blocks whose only job is to feed one JSX map.

Do not pass a `model` object or `Record<string, any>` through a table, toolbar, and row. Pass the fields those components use.

If a view file is mostly derivation, move the derivation until the component is `get*` functions, handlers, and the return.
