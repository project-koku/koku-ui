# Agent instructions — `koku-ui-sources`

Cost Management **Sources** UI (on-prem / federated module). Paths below are relative to this package: `apps/koku-ui-sources/`.

---

## Authoring conventions (preferences)

| Kind | Convention |
|------|----------------|
| **Folders** | `kebab-case` (e.g. `src/apis/`, `src/components/sources-page/`) |
| **Non-React TypeScript** (`*.ts`) | `kebab-case` filenames (e.g. `sources-service.ts`, `api-error-service.ts`) |
| **React modules** (`*.tsx`) | `PascalCase` for files that primarily export components (e.g. `SourcesPage.tsx`, `SourceDetail.tsx`) |
| **React functional components** | **`export const ComponentName = …`** for exported FCs, then **`ComponentName.displayName = 'ComponentName'`** (same string). File-local FCs use `const` + matching `displayName` (no `export`). Class components (e.g. error boundary) may use `export { ClassName }` and set **`ClassName.displayName`** on the class. |
| **Exports** | **Named exports** for all modules under `src/` (e.g. `export const axiosInstance`, `export const messages`, slice reducers as `export const sourcesReducer`). The **only** default-export carve-out is **`src/fed-modules/`** (e.g. `export default SourcesPageWrapper` after a named `export const` component). Root build/config (e.g. `webpack.config.ts`) and ambient `*.d.ts` follow ecosystem norms. |

Exported **symbols** may use established patterns (e.g. `SourcesService` object, `CreateSourcePayload` interface) independent of filename casing.

**Do not add barrel `index.ts` files** in this package (no re-export grab bags): import **concrete modules** (e.g. `from 'apis/sources-service'`, `from 'apis/models/sources'`, `from 'components/.../ddf-component-mapper'`) so dependency edges stay visible and Jest mocks stay aligned with production import paths.

---

## Layout notes

- **`src/apis/`** — External API integration: shared **`axiosInstance`** + **`API_BASE`** in **`axios-client.ts`** (named exports); HTTP services (`sources-service.ts`, `applications-service.ts`, `api-error-service.ts`) with **path constants colocated** on each service module; **`models/`** for request/response shapes (`sources.ts`, `applications.ts`); **`source-types.ts`** for UI/source-type metadata; **MSW** mocks under **`mock/`**. Use explicit imports—no `apis/index.ts`.
- **Tests** for each service live as **`*-service.test.ts`** next to the service file.

---

## Testing

- Jest; tests colocated as `*.test.ts` / `*.test.tsx` next to sources or under the same feature folder.
- Mock the **same module path** the code under test imports (e.g. `jest.mock('apis/sources-service')`), not a barrel, unless the test targets **`axios-client`** itself.

---

## Related docs

- Broader monorepo / ecosystem context may live in sibling repos (e.g. `koku/AGENTS.md`) or workspace rules; this file scopes **this app only**.
