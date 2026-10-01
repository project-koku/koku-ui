---
name: transform-generated-ui
description: >-
  Transforms AI-generated Cost Management UI into this repository's component,
  folder, styling, and data-hook style. Use when rewriting designer prototypes,
  generated settings features, flat mega-file React UI, or when asked to match
  Cost Management coding style. Does not implement new APIs.
disable-model-invocation: true
---

# Transform generated UI

Rewrite a generated feature so it matches Cost Management route style. Replace the generated files. Do not leave deprecated wrappers, `Old*` copies, or class-component shells.

The target directory may be this repo or another checkout. Pass that directory in the request. Read the standards before writing code:

- [organization.md](organization.md) — tree, names, exports, file split
- [composition.md](composition.md) — page, table, toolbar, and action layout inside those files
- [presentation.md](presentation.md) — components, PatternFly, shared wrappers, charts, styles
- [data.md](data.md) — `useMapToProps`, copy, tests

## Scope

- Keep the prototype's screens, actions, empty states, filtered-empty states, and read-only behavior.
- Update existing entry points (tabs, routes) so they render the rewritten components.
- Do not add API modules, store slices, or network calls. Mock data is returned from `useMapToProps`. See [data.md](data.md).
- Do not use the settings integrations feature as a style reference.
- Before writing a page, a table, or an action, open one of each under `apps/koku-ui-hccm/src/routes/settings/exchangeRates` or `priceLists` and match [composition.md](composition.md). Do not copy those directory or file names. Name each new folder for the responsibility it has in the feature being transformed. A settings-page tab is its own directory under `routes/settings/`. Do not nest one settings tab inside another feature.

## Workflow

Copy this checklist and keep it current:

```
Task Progress:
- [ ] Inventory the generated feature
- [ ] Name a tree from those responsibilities
- [ ] Rewrite in place and delete the originals
- [ ] Return mocked props from useMapToProps
- [ ] Review with PatternFly standards agents
- [ ] Check styles, copy, structure, and tests
```

### 1. Inventory

List screens, tabs, tables, toolbars, headers, row actions, modals, charts, duplicated helpers, and where mock data lives. Mark each settings-page tab as its own feature. Note class components, `connect`, `injectIntl`, `style={{}}`, raw colors, hardcoded strings, sessionStorage, and context providers used as a fake API.

### 2. Name a tree

Propose the tree before editing. Follow [organization.md](organization.md). A settings-page tab is a sibling directory under `routes/settings/`: `settings/priceLists` for "Price lists" and `settings/requests` for "Requests". Do not put the Requests tab in `settings/priceLists/requests`. Detail tabs stay inside their feature. `components/`, `components/state`, and `utils` are the role folders to use when those roles exist.

### 3. Rewrite

One primary component per file. A file that mixes a page, a table, a toolbar, several modals, and a chart gets split. A single dense form may stay together when further splits would be arbitrary.

Write the inside of each file the way [composition.md](composition.md) describes. A page is `// Getters`, a `// Handlers` block of `handleOn*`, a `// Effects` block, and a `// Render` comment immediately before the return. A settings list is `DataTable` or `ExpandTable` filled by `initDatum`. An action component owns its modal. Do not keep the prototype's component boundaries or which component owns state.

Write `React.FC` components. The file basename and the component name are the same identifier: `list.tsx` exports `List`, and `priceListCatalog.tsx` exports `PriceListCatalog`. Name the table, toolbar, styles, and tests from that same identifier (`priceListCatalogTable.tsx` exports `PriceListCatalogTable`). Do not leave a short filename with a longer component name. A modal or panel follows the same rule: `requestsModal.tsx` exports `RequestsModal`, and `priceListDetailRequestsPanel.tsx` exports `PriceListDetailRequestsPanel`. Choose the identifier from the behavior the parent, the props, and the message descriptions already use. `PriceListDetailAuditHistoryPanel` lives in `priceListDetailAuditHistoryPanel.tsx`, and the view it renders is `AuditHistoryView` in `auditHistoryView.tsx`. Do not put that panel in `history.tsx`, and do not name the child `HistoryView` when the catalog says "Audit log table column". Do not alias that name in the barrel. See [organization.md](organization.md).

Every React component gets a usage comment on the line immediately above its declaration, including child views, action menus, and modals such as `DetailActions`, `AuditHistoryView`, and `DraftRateModal`. Name this component's role, then where it is used. An action in a toolbar is that action: "Create price list action in the catalog toolbar." A settings page names its tab: "Price list settings tab." "Settings price lists toolbar" and "Settings tab" name the parent. See [organization.md](organization.md).

Move layout to `*.styles.ts`. Move user-visible strings into the message catalog. Deduplicate helpers that appear in more than one surface into that feature's `utils`. Do not pass a `model` bag or `Record<string, any>` through the view.

Delete the generated files those components replace, including mega context providers and sessionStorage stores. Do not re-export the old modules.

### 4. Data seam

Each view that needs remote-shaped data reads it from `useMapToProps` at the bottom of that file. Until an API exists, the function returns fixtures in the shape the page already destructures. Keep a mock value in that same file when only that function uses it. Do not add a file for one constant. Details are in [data.md](data.md).

### 5. PatternFly review

After the new UI exists, launch subagents and apply their findings before finishing:

- `pf-coding-standards` on the rewritten components, layouts, and styles
- `component-structure-audit` when layout nesting is non-trivial (page sections, cards, toolbars, modals, tables, tabs)
- `pf-unit-test-standards` when adding or rewriting tests

Do not paste those agents' rules into the feature. Fix the code they flag.

### 6. Check

- Tree matches the responsibilities found in inventory. No empty packages for journeys the feature does not have. Each settings-page tab is its own directory under `routes/settings/`. `Price lists` is `settings/priceLists`. `Requests` is `settings/requests`. The Requests tab is not `settings/priceLists/requests`. A panel opened from price list detail stays in `priceLists`.
- Each file basename matches its component, and the name matches the behavior. `list.tsx` exports `List`. A `PriceListCatalog` page is `priceListCatalog.tsx`, with `priceListCatalogTable.tsx` and `priceListCatalogToolbar.tsx`. No mixed pair such as `list.tsx` exporting `PriceListCatalog`, `requestsModal.tsx` exporting `PriceListListRequestsModal`, `requests.tsx` exporting `PriceListDetailRequestsPanel`, or `history.tsx` exporting `PriceListDetailAuditHistoryPanel`. A child of that audit panel is `AuditHistoryView` in `auditHistoryView.tsx`, not `HistoryView`. Barrels do not rename exports.
- Every React component has a usage comment on the line immediately above its declaration. That includes pages, tables, toolbars, headers, actions, modals, empty states, `forwardRef` components, and unexported components in the same file. `DetailActions`, `AuditHistoryView`, and `DraftRateModal` are not exempt. The comment names this component's role, then where it is used: "Create price list action in the catalog toolbar" and "Price list settings tab." "Settings price lists toolbar" and "Settings tab" name the parent. A comment elsewhere in the file does not count. Do not add a second comment when that line is already a comment.
- Components use `// Getters`, `// Handlers`, `// Effects`, and `// Render`. Every `useEffect` is in `// Effects`. `// Render` is immediately after `// Effects` and immediately before the first return. Tables use `DataTable` or `ExpandTable` with `initDatum`. Actions own their modals. No `model` bags. No hand-built settings table when `DataTable` fits.
- No file owns more than one primary component, except a dense form left intact on purpose.
- No `style={{}}` for layout or color. No hex colors or color-name literals. Tokens live in `*.styles.ts`.
- No chart built from `div`s or HTML tables.
- No hardcoded user-visible strings.
- No new class components, `connect`, or `injectIntl`.
- `useMapToProps` is the only mock boundary. No sessionStorage provider. A mock value used by one function lives in that file. No `fixtures/` file for a single constant.
- Co-located behavior tests exist for the new public components.
- Shared wrappers were searched before any new primitive was added.
- Tests, the app typecheck, and a start-script smoke check were run after the rewrite. Failures introduced by the transform are fixed before finishing. `package.json` and the lockfile were not edited.

### 7. Verify

Do not change `package.json` or the lockfile. Do not edit files inside installed packages.

From `apps/koku-ui-hccm`, run the tests for the rewritten feature:

```
npx jest --watchman=false <feature test paths> --no-coverage --forceExit
```

From the repo root, typecheck the app:

```
./node_modules/typescript/bin/tsc --noEmit --pretty false -p apps/koku-ui-hccm/tsconfig.json
```

Fix type errors and test failures in the rewritten feature. Errors that already exist outside that feature, such as `api/rbac.ts`, stay as they are.

`node_modules/.bin` entries must be symlinks into the package that owns them. npm does not replace an existing copied file on the next install. A copied script resolves relative `require`s from `.bin` and breaks the repo: `ts-patch` looks for `../cli/cli` (`npm install` / `postinstall`), and `concurrently` looks for `../src/assert` (`npm run start:onprem:standalone-mock`). Before finishing, run `node node_modules/.bin/concurrently --version` and `node node_modules/.bin/ts-patch check`. If either fails because the launcher is a regular file, replace every copied `.bin` entry with a symlink to that package's `bin` target (or `directories.bin` when `bin` is absent). Do not change application source to work around a copied launcher.
