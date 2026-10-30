# Organization

Structure a feature by user journey, then by UI role. Prefer a tree over a flat folder.

## Features

A tab on the settings page is its own feature. Give it a directory directly under `routes/settings/`, next to the other settings features. Name that directory for the tab.

The settings page shows "Price lists" and "Requests" as separate tabs. `Price lists` is `settings/priceLists`. `Requests` is `settings/requests`. Do not put the Requests tab in `settings/priceLists/requests`.

A journey inside one feature stays in that feature. A detail tab, a catalog row modal, and an activity panel are not settings tabs. The price list detail activity drawer can show requests for one list and stay under `settings/priceLists`. The Requests settings tab does not.

When one feature embeds another's table, import that table. Do not move the settings tab into the feature that embeds it.

## Journeys

Give each journey its own package when the feature actually has that journey:

- A list or settings surface (table, toolbar, empty and error states)
- A detail surface (header plus tabs)
- A create or edit flow, when that flow is its own screen

Name the package for what the user is doing or viewing in this feature. Do not reuse another feature's folder names, and do not apply a fixed suffix such as `Create` or `Breakdown` unless that word is the clearest name for this feature.

Omit journeys the feature does not have. A list-only screen does not get an empty detail or editor package.

## Tabs, roles, and files

A detail tab that owns a table, toolbar, or empty state gets its own directory inside that feature, named for the tab's subject. A settings-page tab is a feature directory under `routes/settings/`, not a directory inside another feature.

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

Pick one identifier for a surface and use it for the directory, the file, and the component. camelCase for directories and files. PascalCase for the component. Do not use PascalCase filenames.

`list.tsx` exports `List`. `priceListCatalog.tsx` exports `PriceListCatalog`. Do not put `PriceListCatalog` in `list.tsx`, and do not put `List` in `priceListCatalog.tsx`.

Sibling files use that same identifier plus the role. Styles and tests use the same basename.

| Component | Page file | Table | Toolbar |
|-----------|-----------|-------|---------|
| `List` | `list.tsx` | `listTable.tsx` exports `ListTable` | `listToolbar.tsx` exports `ListToolbar` |
| `PriceListCatalog` | `priceListCatalog.tsx` | `priceListCatalogTable.tsx` exports `PriceListCatalogTable` | `priceListCatalogToolbar.tsx` exports `PriceListCatalogToolbar` |

`list.tsx` with `listTable.tsx` is consistent. `list.tsx` with `PriceListCatalog` and `listTable.tsx` is not. `priceListCatalog.tsx` with `listTable.tsx` is not.

The same rule applies to modals and panels. `requestsModal.tsx` exports `RequestsModal`. `priceListDetailRequestsPanel.tsx` exports `PriceListDetailRequestsPanel`. Do not export `PriceListListRequestsModal` from `requestsModal.tsx`, and do not export `PriceListDetailRequestsPanel` from `requests.tsx`. A reader should find the component by searching for the file name.

Name that identifier for the behavior the parent, the props, and the message descriptions already use. Do not shorten it to a generic synonym that drops the distinguishing word.

`PriceListDetailAuditHistoryPanel` shows an audit log. Its catalog descriptions say "Audit log table column" and "Audit expandable nested table — column header". The file is `priceListDetailAuditHistoryPanel.tsx`. Do not put that panel in `history.tsx`.

A child that renders the same surface reuses the parent's subject. The view rendered by `PriceListDetailAuditHistoryPanel` is `AuditHistoryView` in `auditHistoryView.tsx`, with `AuditHistoryViewProps`. Do not name it `HistoryView`.

Do not rename an export in `index.ts`. `export { PriceListListRequestsModal as RequestsModal }` hides the component. The barrel exports the same identifier the file exports.

When the export name changes, update the barrels and the existing entry points that render it. Do not keep the old component name so those imports can stay unchanged.

- Every package has an `index.ts` barrel. Import from the package index, not from a deep file path.
- A surface embedded in a tab uses a named export.
- A route entry loaded with `React.lazy` uses a default export. The barrel re-exports that default.

```ts
// Named surface
export { PolicyList };

// Lazy route entry
export { default } from './policyEditor';
```

## Usage comment

Every React component in the feature has a usage comment. That includes the page, the table, the toolbar, the header, each action, each modal, each empty state, and each child view. `DetailActions`, `AuditHistoryView`, and `DraftRateModal` are components and need the same comment. A `forwardRef` component needs it. An unexported component in the same file needs it. A small component needs it.

Put the comment on the line immediately above the component declaration (`const`, `function`, or `forwardRef`). Do not put it above the props interface. Do not restate the component name. One or two sentences.

The first sentence names this component's role, then where that role is used. An action rendered in a toolbar is the action. `CreatePriceList` is "Create price list action in the catalog toolbar. Opens the create price list route." "Settings price lists toolbar" names the toolbar, so it reads as if this component is the toolbar.

A settings page names its tab. `PriceListCatalog` is "Price list settings tab. Shows price lists and opens one to view its rates and assignments." "Settings tab" does not say which tab.

Do not skip a component because its parent file has a comment, because the component looks obvious, or because a comment exists somewhere else in the file. Skip only when that comment is already on the line immediately above the declaration.

```tsx
// Create price list action in the catalog toolbar. Opens the create price list route.
const CreatePriceList: React.FC<CreatePriceListProps> = ({ canWrite = true }) => {
```

```tsx
// Price list settings tab. Shows price lists and opens one to view its rates and assignments.
const PriceListCatalog: React.FC<PriceListCatalogProps> = ({ canWrite = true }) => {
```

```tsx
// Catalog row action. Shows update requests for one price list.
const RequestsModal: React.FC<RequestsModalProps> = ({ listId, onClose }) => {
```

```tsx
// Price list detail header. Opens edit, deprecate, and delete for the open price list.
const DetailActions: React.FC<DetailActionsProps> = ({ list }) => {
```

```tsx
// Rendered by the price list detail audit panel. Shows the audit log and its expandable change rows.
const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({ rows }) => {
```

```tsx
// Price list editor. Opens while a draft rate is created or edited, before the list is saved.
const DraftRateModal: React.FC<DraftRateModalProps> = ({ isOpen, onClose }) => {
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

Group component methods with short comments, in this order: `// Getters`, `// Handlers`, `// Effects`, `// Render`. `// Effects` holds every `useEffect`. `// Render` sits immediately after `// Effects` and immediately before the first return.

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

A feature whose editor is a modal does not get `policyEditor/`. A detail tab with no table of its own stays inside its parent. Name `channels` only when that is the detail tab's subject. `channels` is not a second settings tab.
