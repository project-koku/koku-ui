# Organization

Structure a feature by user journey, then by UI role. Prefer a tree over a flat folder.

## Journeys

Give each journey its own package when the feature actually has that journey:

- A list or settings surface (table, toolbar, empty and error states)
- A detail surface (header plus tabs)
- A create or edit flow, when that flow is its own screen

Name the package for what the user is doing or viewing in this feature. Do not reuse another feature's folder names, and do not apply a fixed suffix such as `Create` or `Breakdown` unless that word is the clearest name for this feature.

Omit journeys the feature does not have. A list-only screen does not get an empty detail or editor package.

## Tabs, roles, and files

A tab that owns a table, toolbar, or empty state gets its own directory, named for the tab's subject.

Inside a surface:

| Role | Where it lives |
|------|----------------|
| Page | Package root. Owns query state, pagination, and loading / error / empty branching. |
| Table, toolbar, header | Sibling files of that page. The filename says which role it is. |
| Row or page actions | `components/<action>/`, one folder per action (edit, delete, review, or whatever the feature needs). |
| Empty states | `components/state/` |
| Hooks and pure helpers | `utils/` at the feature root when several surfaces share them, or under the surface that owns them |
| Styles and tests | Colocated `*.styles.ts` and `*.test.tsx` with the same basename as the component |

`components`, `state`, and `utils` are role names. Use them when that role exists. Journey and action folder names are specific to the feature.

One primary component per file. Split a file that mixes a page, a table, a toolbar, several modals, and a chart. Keep a dense form in one file when splitting it would only scatter one form.

An action opened from a menu is an orchestrator plus a modal. A form shared by add and edit is its own content component.

## Names and exports

- Directories and files are camelCase.
- Component identifiers are PascalCase. The filename matches the component (`policyList.tsx` exports `PolicyList`). Do not use PascalCase filenames.
- Every package has an `index.ts` barrel. Import from the package index, not from a deep file path.
- A surface embedded in a tab uses a named export.
- A route entry loaded with `React.lazy` uses a default export. The barrel re-exports that default.

```ts
// Named surface
export { PolicyList };

// Lazy route entry
export { default } from './policyEditor';
```

Props interfaces use these suffixes, then a single props alias:

```ts
interface PolicyListOwnProps {
  canWrite?: boolean;
}

export interface PolicyListMapProps {
  query?: Query;
}

export interface PolicyListStateProps {
  items?: PolicyListData;
  itemsError?: AxiosError;
  itemsFetchStatus?: FetchStatus;
}

type PolicyListProps = PolicyListOwnProps;
```

`MapProps` and `StateProps` exist even when only `useMapToProps` uses them.

Group component methods with short comments: `Getters`, `Handlers`, `Effects`.

## Illustration, not a skeleton

This tree shows granularity only. Invent names from the feature being transformed. Do not create packages that this picture happens to include.

```
notificationPolicies/
  index.ts
  policyList/
    policyList.tsx
    policyListTable.tsx
    policyListToolbar.tsx
    policyList.styles.ts
    index.ts
    components/
      actions/
      delete/
      state/
  policyDetail/
    policyDetail.tsx
    policyDetailHeader.tsx
    channels/
    schedule/
  policyEditor/
```

A feature whose editor is a modal does not get `policyEditor/`. A tab with no table of its own stays inside its parent. Name `channels` only when that is the tab's subject.
