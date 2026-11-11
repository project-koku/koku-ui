---
date: 2026-11-04
spec: ../specs/0007-onprem-federated-sources.md
decisions:
  - ../decisions/0007-001-keep-chrome-appnames.md
  - ../decisions/0007-002-keep-koku-ui-sources-until-cutover.md
  - ../decisions/0007-003-integration-detail-leaves-settings.md
  - ../decisions/0007-004-omit-applications-card.md
  - ../decisions/0007-005-leave-connected-applications-upstream.md
  - ../decisions/0007-006-sort-sources-in-the-shim.md
---

# On-prem federated Sources

This record was written after the work shipped. The change predates the docs tracker, so this is the landed design, not an unstarted task list.

[COST-8526](https://redhat.atlassian.net/browse/COST-8526) stays open until `koku-ui-sources` can leave the image. [COST-8527](https://redhat.atlassian.net/browse/COST-8527) is the upstream row-action fix, [sources-ui#1534](https://github.com/RedHatInsights/sources-ui/pull/1534).

## Context

On-prem Settings → Integrations used `koku-ui-sources`. The replacement is upstream [sources-ui](https://github.com/RedHatInsights/sources-ui), vendored at `vendor/sources-ui` and built as the federated remote `sources-ui-onprem` (`./RootApp`, `/sources/`). The host is Cost Management. Koku's sources REST API is unchanged.

SaaS Insights appnames stay `cost-management` and `cost-management-ros`. Chrome module keys stay `costManagement` and `costManagementRos`.

## Approach

Webpack in `apps/sources-ui-onprem` replaces six upstream modules. The screens stay upstream.

| Shim | Role |
|------|------|
| `src/shims/entities.js` | `getSourcesApi()` talks to `/api/cost-management/v1/sources` |
| `src/shims/TabNavigation.tsx` | Renders nothing, so Cloud and Red Hat tabs are not shown |
| `src/shims/AvailabilityChecker.tsx` | Reloads the Cost source instead of the Insights availability check |
| `src/shims/ApplicationsCard.tsx` | Renders nothing. The summary column stays |
| `src/shims/utils.ts` | `linkBasename` is `/openshift/cost-management/settings/integrations` |
| `src/shims/computeSourcesUrl.ts` | Hardcoded Sources links use that settings path |

`costSourcesApi.js` copies `name`, `source_ref`, and `created_timestamp` (as `created_at`). It stores the Cost `uuid` in `id`, uses source type id `5` and application type id `2`, and invents one Cost Management application with empty endpoints and authentications. Pause and resume are `PATCH` `{ "paused": true | false }`. Create posts `{ name, source_type: "OCP", authentication.credentials.cluster_id }` and then `/applications`. `pauseApplication`, `unpauseApplication`, `deleteApplication`, and `createApplication` reject. Those actions belong on the integration, so the Applications card is omitted.

The list request is `type=OCP`, with `name` when the user searched. The shim then filters integration type, connected application, and availability, sorts Name, Type, and Date added, and slices the page. Koku's sources list ignores `ordering`.

## Host

`KOKU_UI_ONPREM_SOURCES_ENABLED` (`isOnpremSourcesEnabled`) selects the remote. On-prem webpack defaults it to true. `false` loads `koku-ui-sources` `./SourcesPage`. SaaS `fec.config.js` hardcodes `false`.

With the flag on, `/settings/integrations/*` stays nested under Settings so Sources routing works. A path matching `/settings/integrations/detail` drops the Settings title and tabs and renders only the federated `RootApp`, the same pattern as a cost-model or price-list breakdown. The list stays in the Integrations tab. `linkBasename` makes Sources breadcrumbs read Integrations → {name}.

The Integrations tab requires sources access, not settings write access.

`scripts/onprem/setup-operator.sh`, IQE setup, and `sync-keycloak-realm-users.sh` grant `sources:*:*` (role "On-Prem Cloud Administrator") to `admin` and `viewer` on tenants `1234567` and `org1234567`.

## Detail page

Manage connected applications stays the upstream edit form. Every on-prem record has an empty authentication list, the Cost Management application, and a non-empty `source_ref`, so sources-ui's OpenShift operator exception disables Cluster Identifier ("Value cannot be modified since it has been set using the API"). Save changes and Reset stay disabled because that field cannot change. Cloud administrator permission shows the form. It does not unlock the field.

The OpenShift schema does not include a hidden `authentication.authtype` field. A nested `initialValue` on that field marks the edit form dirty and flashes Save and Reset. The add-source wizard still sets the token type from its own step.

Do not replace `Detail.js`. A null Applications card leaves the upstream half-width summary column, which matches SaaS. Replacing the page to widen the summary was tried and removed.

## Related upstream change

`SourcesTable` builds Pause, Edit, and Remove in a `useMemo`. If that memo depends only on the rows, the kebab stays disabled when the table paints before `GET /api/rbac/v1/access/?application=sources` returns `sources:*:*` or `sources:*:write`. The federated host hits that race. A normal console.redhat.com session usually does not, because the access call finishes first. The fix is [sources-ui#1534](https://github.com/RedHatInsights/sources-ui/pull/1534). Pause on that kebab is `pauseSource`, not `pauseApplication`.
