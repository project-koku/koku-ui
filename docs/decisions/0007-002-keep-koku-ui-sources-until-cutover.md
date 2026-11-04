---
status: accepted
date: 2026-11-04
---

# Keep koku-ui-sources until cutover

## Context and Problem Statement

Settings → Integrations can load either the federated sources-ui remote or the existing `koku-ui-sources` page. Removing the legacy app from the image at the same time as the cut-in leaves no way back if the remote is wrong.

## Considered Options

- Delete `koku-ui-sources` from the on-prem image and the Scalprum config once `sources-ui-onprem` loads
- Keep both, and select with `KOKU_UI_ONPREM_SOURCES_ENABLED`

## Decision Outcome

Chosen option: **keep both until cutover**. On-prem defaults the flag to true, so Integrations loads `sources-ui-onprem` `./RootApp`. `false` loads `koku-ui-sources` `./SourcesPage` (`start:onprem:operator:koku-ui-sources` sets that). SaaS hardcodes the flag false. [COST-8526](https://redhat.atlassian.net/browse/COST-8526) tracks removing the legacy app.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because the legacy page is one env value away.
- Neutral, because both remotes stay in the image until that ticket closes.
