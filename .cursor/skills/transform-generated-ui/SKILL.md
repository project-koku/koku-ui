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
- [presentation.md](presentation.md) — components, PatternFly, shared wrappers, charts, styles
- [data.md](data.md) — `useMapToProps`, copy, tests

## Scope

- Keep the prototype's screens, actions, empty states, filtered-empty states, and read-only behavior.
- Update existing entry points (tabs, routes) so they render the rewritten components.
- Do not add API modules, store slices, or network calls. Mock data is returned from `useMapToProps`. See [data.md](data.md).
- Do not use the settings integrations feature as a style reference.
- When a split or name is ambiguous, read one comparable feature under `apps/koku-ui-hccm/src/routes/settings` to judge granularity only. Do not copy that feature's directory or file names. Name each new folder for the responsibility it has in the feature being transformed.

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

List screens, tabs, tables, toolbars, headers, row actions, modals, charts, duplicated helpers, and where mock data lives. Note class components, `connect`, `injectIntl`, `style={{}}`, raw colors, hardcoded strings, sessionStorage, and context providers used as a fake API.

### 2. Name a tree

Propose the tree before editing. Follow [organization.md](organization.md). Journey and tab names come from what that UI does. `components/`, `components/state`, and `utils` are the role folders to use when those roles exist.

### 3. Rewrite

One primary component per file. A file that mixes a page, a table, a toolbar, several modals, and a chart gets split. A single dense form may stay together when further splits would be arbitrary.

Write `React.FC` components. Move layout to `*.styles.ts`. Move user-visible strings into the message catalog. Deduplicate helpers that appear in more than one surface into that feature's `utils`.

Delete the generated files those components replace, including mega context providers and sessionStorage stores. Do not re-export the old modules.

### 4. Data seam

Each view that needs remote-shaped data reads it from `useMapToProps` at the bottom of that file. Until an API exists, the function returns fixtures in the shape the page already destructures. Details are in [data.md](data.md).

### 5. PatternFly review

After the new UI exists, launch subagents and apply their findings before finishing:

- `pf-coding-standards` on the rewritten components, layouts, and styles
- `component-structure-audit` when layout nesting is non-trivial (page sections, cards, toolbars, modals, tables, tabs)
- `pf-unit-test-standards` when adding or rewriting tests

Do not paste those agents' rules into the feature. Fix the code they flag.

### 6. Check

- Tree matches the responsibilities found in inventory. No empty packages for journeys the feature does not have.
- No file owns more than one primary component, except a dense form left intact on purpose.
- No `style={{}}` for layout or color. No hex colors or color-name literals. Tokens live in `*.styles.ts`.
- No chart built from `div`s or HTML tables.
- No hardcoded user-visible strings.
- No new class components, `connect`, or `injectIntl`.
- `useMapToProps` is the only mock boundary. No sessionStorage provider.
- Co-located behavior tests exist for the new public components.
- Shared wrappers were searched before any new primitive was added.
