---
name: create-hccm-ui
description: >-
  Creates a Cost Management page, settings tab, table, toolbar, modal, or chart
  in apps/koku-ui-hccm. Use when adding a new screen or settings feature.
  Reads the shared route standards and generates that structure on the first
  pass. Does not implement new APIs.
---

# Create Cost Management UI

Write the feature to Cost Management route style on the first pass. Do not leave a flat prototype for a later transform.

Read these files before writing any component. Do not rely on a summary of them:

- [organization.md](../transform-generated-ui/organization.md) — tree, names, exports, file split
- [composition.md](../transform-generated-ui/composition.md) — page, table, toolbar, and action layout inside those files
- [presentation.md](../transform-generated-ui/presentation.md) — components, PatternFly, shared wrappers, charts, styles
- [data.md](../transform-generated-ui/data.md) — `useMapToProps`, copy, tests

## Scope

- Build the screens, actions, empty states, filtered-empty states, and read-only behavior the request describes.
- Wire existing entry points (tabs, routes) so they render the new components.
- Do not add API modules, store slices, or network calls. Mock data is returned from `useMapToProps`. See [data.md](../transform-generated-ui/data.md).
- Do not use the settings integrations feature as a style reference.
- Before writing a page, a table, or an action, open one of each under `apps/koku-ui-hccm/src/routes/settings/exchangeRates` or `priceLists` and match [composition.md](../transform-generated-ui/composition.md). Do not copy those directory or file names. Name each new folder for the responsibility it has in this feature. A settings-page tab is its own directory under `routes/settings/`. Do not nest one settings tab inside another feature.

Use [transform-generated-ui](../transform-generated-ui/SKILL.md) only when the user asks to rewrite an existing generated tree.

## Workflow

```
Task Progress:
- [ ] Name a tree from the screens in the request
- [ ] Write the components to the standards
- [ ] Return mocked props from useMapToProps
- [ ] Review with PatternFly standards agents
- [ ] Check styles, copy, structure, and tests
```

### 1. Name a tree

Propose the tree before editing. Follow [organization.md](../transform-generated-ui/organization.md). A settings-page tab is a sibling directory under `routes/settings/`: `settings/priceLists` for "Price lists" and `settings/requests` for "Requests". Do not put the Requests tab in `settings/priceLists/requests`. Detail tabs stay inside their feature. `components/`, `components/state`, and `utils` are the role folders to use when those roles exist.

### 2. Write

One primary component per file. A file that mixes a page, a table, a toolbar, several modals, and a chart gets split. A single dense form may stay together when further splits would be arbitrary.

Write the inside of each file the way [composition.md](../transform-generated-ui/composition.md) describes. A page is `// Getters`, a `// Handlers` block of `handleOn*`, a `// Effects` block, and a `// Render` comment immediately before the return. A settings list is `DataTable` or `ExpandTable` filled by `initDatum`. An action component owns its modal.

Write `React.FC` components. The file basename and the component name are the same identifier: `list.tsx` exports `List`, and `priceListCatalog.tsx` exports `PriceListCatalog`. Name the table, toolbar, styles, and tests from that same identifier (`priceListCatalogTable.tsx` exports `PriceListCatalogTable`). Do not leave a short filename with a longer component name. A modal or panel follows the same rule: `requestsModal.tsx` exports `RequestsModal`, and `priceListDetailRequestsPanel.tsx` exports `PriceListDetailRequestsPanel`. Choose the identifier from the behavior the parent, the props, and the message descriptions already use. `PriceListDetailAuditHistoryPanel` lives in `priceListDetailAuditHistoryPanel.tsx`, and the view it renders is `AuditHistoryView` in `auditHistoryView.tsx`. Do not put that panel in `history.tsx`, and do not name the child `HistoryView` when the catalog says "Audit log table column". Do not alias that name in the barrel. See [organization.md](../transform-generated-ui/organization.md).

Every React component gets a usage comment on the line immediately above its declaration, including child views, action menus, and modals such as `DetailActions`, `AuditHistoryView`, and `DraftRateModal`. Name this component's role, then where it is used. An action in a toolbar is that action: "Create price list action in the catalog toolbar." A settings page names its tab: "Price list settings tab." "Settings price lists toolbar" and "Settings tab" name the parent. See [organization.md](../transform-generated-ui/organization.md).

Move layout to `*.styles.ts`. Move user-visible strings into the message catalog. Deduplicate helpers that appear in more than one surface into that feature's `utils`. Do not pass a `model` bag or `Record<string, any>` through the view.

### 3. Data seam

Each view that needs remote-shaped data reads it from `useMapToProps` at the bottom of that file. Until an API exists, the function returns fixtures in the shape the page already destructures. Keep a mock value in that same file when only that function uses it. Do not add a file for one constant. Details are in [data.md](../transform-generated-ui/data.md).

### 4. Review and check

After the UI exists, follow sections 5, 6, and 7 of [transform-generated-ui/SKILL.md](../transform-generated-ui/SKILL.md): PatternFly reviews, the structure and copy checks, feature tests, the app typecheck, and the `.bin` launcher checks. Apply findings that do not conflict with [composition.md](../transform-generated-ui/composition.md). Do not edit `package.json` or the lockfile.
