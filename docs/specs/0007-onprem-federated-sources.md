---
date: 2026-11-04
plan: ../plans/0007-onprem-federated-sources.md
---

# On-prem federated Sources

## Context

On-prem Cost Management Settings → Integrations should use upstream sources-ui, loaded as a federated module, while Koku's sources API and the SaaS Chrome registration stay as they are. `koku-ui-sources` remains available until cutover.

The work shipped before this tracker existed. [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md) is the record of what landed.

## Requirements

- Settings → Integrations loads `sources-ui-onprem` `./RootApp` when `KOKU_UI_ONPREM_SOURCES_ENABLED` is true, and `koku-ui-sources` `./SourcesPage` when it is false.
- The remote talks to `/api/cost-management/v1/sources`. Koku's API is not extended for Sources query shapes.
- List and detail stay under `/openshift/cost-management/settings/integrations`. Detail, including child routes, has no Settings title or tabs. The breadcrumb sits at the top of the page.
- The catalog is OpenShift / Red Hat only. Pause and resume apply to the integration (`PATCH` `{ paused }`), not to the Cost Management application.
- Cluster Identifier on Manage connected applications stays disabled for these records. Save changes and Reset stay disabled with it.
- Name search and `type=OCP` go to the API. Integration type, application, and availability filters, and column sort, are applied in the shim.
- SaaS appnames stay `cost-management` and `cost-management-ros`.

## Considered options

- Rename the Insights appnames and Chrome module ids to `koku-ui-hccm` / `kokuUiHccm`. Rejected. See [0007-001-keep-chrome-appnames.md](../decisions/0007-001-keep-chrome-appnames.md).
- Remove `koku-ui-sources` from the on-prem image as part of this cut-in. Rejected. See [0007-002-keep-koku-ui-sources-until-cutover.md](../decisions/0007-002-keep-koku-ui-sources-until-cutover.md).
- Leave integration detail inside the Settings tab. Rejected. See [0007-003-integration-detail-leaves-settings.md](../decisions/0007-003-integration-detail-leaves-settings.md).
- Show a disabled Applications card, or replace the upstream detail page so the summary spans the row. Rejected. See [0007-004-omit-applications-card.md](../decisions/0007-004-omit-applications-card.md).
- Replace Manage connected applications with a read-only card, or enable Cluster Identifier because the user has `sources:*:*`. Rejected. See [0007-005-leave-connected-applications-upstream.md](../decisions/0007-005-leave-connected-applications-upstream.md).
- Send `ordering` and wait for Koku to sort. Rejected. See [0007-006-sort-sources-in-the-shim.md](../decisions/0007-006-sort-sources-in-the-shim.md).

## Outcome

`apps/sources-ui-onprem` is a webpack wrapper around the vendored sources-ui submodule. The host mounts it from Settings. The legacy sources app remains behind the flag. Detail is a full page. The Applications card is absent, and the summary keeps the SaaS half-width column. Manage connected applications is the upstream form, with Cluster Identifier disabled for every current on-prem record. The shim sorts and pages the list after the Cost API returns it.
