---
status: accepted
date: 2026-11-04
---

# Integration detail leaves the Settings chrome

## Context and Problem Statement

Sources already has a detail route at `detail/:id`, with its own breadcrumb. Inside Settings, that breadcrumb sat under the Settings title and tabs. Cost-model and price-list breakdowns unmount that chrome so the breadcrumb is at the top of the page.

## Considered Options

- Leave detail nested in the Integrations tab, under the Settings title
- When the path is `/settings/integrations/detail` (including child routes), render only the federated app in a `PageSection`

## Decision Outcome

Chosen option: **drop the Settings chrome on detail**. The list stays in the Integrations tab. `/settings/integrations/*` stays nested so Sources' own router still matches. `linkBasename` is `/openshift/cost-management/settings/integrations`, so the Sources breadcrumb reads Integrations → {name}. The legacy `integrationBreakdown` route stays for the flag-off path and is filtered out of the top-level router when the flag is on.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because detail matches the other settings breakdown pages.
- Neutral, because the host, not sources-ui, decides when the chrome is hidden.
