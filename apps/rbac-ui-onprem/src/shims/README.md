# rbac-ui-onprem shims

Webpack replaces upstream modules so federated IAM runs inside `koku-ui-onprem` without freezing the tab.

| Shim | Replaces | Why |
|------|----------|-----|
| `insights-rbac/useAppLink` | `shared/hooks/useAppLink` | Host already uses `basename="/iam"`; strip double `/iam` prefix on `Navigate` |
| `insights-rbac/LoaderPlaceholders` | `ui-states/LoaderPlaceholders` | `AppPlaceholder` used real `SkeletonTable` → ThBase loop |
| ~~`insights-rbac/TableView`~~ | — | **Removed (rc19+):** use upstream `TableView` for Storybook-parity toolbars; keep `LoaderPlaceholders` / `SkeletonTable` shims only |
| `patternfly/SkeletonTable*` | PF `SkeletonTable` subpaths | Same ThBase issue for dynamic/esm imports |
| `patternfly/component-groups` | `@patternfly/react-component-groups` (package root) | `RolesTable` imports `{ SkeletonTableBody }` from barrel — must not load shared chunk 6658 on cluster |

Shared UI: `placeholders.tsx` (`OnpremIamSpinner`, `OnpremIamSkeletonBox`).

Paths for webpack: `webpack-paths.ts`.
