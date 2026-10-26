# sources-ui-onprem

On-prem federated remote for **sources-ui** (scope `sources-ui-onprem`, `/sources-ui-onprem/`, `./RootApp`). No upstream repo edits. `koku-ui-sources` stays at scope `koku-ui-sources` and `/koku-ui-sources/`.

Settings Integrations loads this app. Set `KOKU_UI_ONPREM_SOURCES_ENABLED=false` to load `koku-ui-sources` instead.

## Vendored upstream

```text
vendor/sources-ui/                               # git submodule @ pinned commit
apps/sources-ui-onprem/package.json              # devDependency: file:../../vendor/sources-ui
```

Clone koku-ui with submodules:

```bash
git clone --recurse-submodules https://github.com/project-koku/koku-ui.git
# or after clone:
git submodule update --init vendor/sources-ui
```

### Bump upstream ref

```bash
cd vendor/sources-ui
git fetch origin && git checkout <full-sha>
cd ../..
git add vendor/sources-ui
git submodule update --init vendor/sources-ui
HUSKY=0 npm install -w @koku-ui/sources-ui-onprem
git add package-lock.json   # if changed
```

Pinned commit: `90d88126f671a407f230338e701ddce936d3ad39` (`fix(integrations): update user-facing SSL mentions to TLS (#1530)`).

## What this wrapper changes

Webpack replaces seven upstream modules. The screens stay upstream.

| Shim | Role |
|------|------|
| `src/shims/entities.js` | `getSourcesApi()` talks to `/api/cost-management/v1/sources` |
| `src/shims/TabNavigation.tsx` | Renders nothing, so Cloud and Red Hat tabs are not shown |
| `src/shims/AvailabilityChecker.tsx` | Reloads `GET /api/cost-management/v1/sources/{uuid}/` instead of the Insights availability check |
| `src/shims/ApplicationsCard.tsx` | Shows the Applications card with the switch and kebab disabled |
| `src/shims/ApplicationResourcesCard.tsx` | Shows a read-only Details card with the cluster identifier |
| `src/shims/utils.ts` | `linkBasename` is `/openshift/cost-management/settings/integrations` |
| `src/shims/computeSourcesUrl.ts` | Hardcoded Sources links point at that settings path |

The Cost translator copies `name`, `source_ref`, and `created_timestamp` (as `created_at`). It stores the Cost `uuid` in `id`, uses source type id `5` and application type id `2`, and invents one Cost Management application plus empty endpoints and authentications. Pause and resume are `PATCH` `{ "paused": true \| false }`. Create posts `{ name, source_type: "OCP", authentication.credentials.cluster_id }` and then `/applications`. Koku's API is unchanged.

Aliases, not reimplementations: `useChrome`, `AsyncComponent`, and a local `useFlag` that defaults `platform.integrations.hcs-disable` to true. `PageHeader`, `PrimaryToolbar`, notifications, and Sentry stay the published packages. `@project-kessel/react-kessel-access-check` is a small stub because on-prem has no Kessel API.

Settings opens `/openshift/cost-management/settings/integrations?category=Red%20Hat`. `Sources.js` only fills in Cloud when the category is still empty, so that URL is the Red Hat list. The entry also writes `category=Red Hat` when the query is missing. A hand-edited `?category=Cloud` URL is an empty catalog because the type file ships OpenShift only.

## Verification

```bash
git submodule update --init vendor/sources-ui
npm ci
npm test -w @koku-ui/sources-ui-onprem
npm run build:onprem -w @koku-ui/sources-ui-onprem
test -f apps/sources-ui-onprem/dist/plugin-manifest.json
```

## Optional upstream follow-up

After this prototype is the one we ship, a small sources-ui PR can replace the webpack swaps with a supported setting:

- basename (default `/settings/integrations`, so console.redhat.com stays the same)
- allowed source type names, or a category, so the wizard can hide AWS, Azure, and GCP without a forked type file
- an overridable `getSourcesApi()`, defaulting to today's `/api/sources/v3.1` client
- a way to hide the tab strip when the host already picked a category

That PR must not mention Cost field names. Defaults have to leave console.redhat.com unchanged. Contacts already noted for that ask: Riccardo Forina, Alexandra Ferdinan, and Veena Kannan’s org.

Host integration: [`apps/koku-ui-onprem/README.md`](../koku-ui-onprem/README.md).
