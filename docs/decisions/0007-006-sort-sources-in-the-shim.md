---
status: accepted
date: 2026-11-04
---

# Sort the sources list in the shim

## Context and Problem Statement

The integrations table sorts Name, Type, and Date added by asking the API to order the page. Koku's sources list has no `OrderingFilter` on `SourcesViewSet`, so `ordering` does not change the payload. `koku-ui-sources` already leaves those column headers unwired for that reason.

Name search is a real query parameter. The list is always `type=OCP`. Integration type, connected application, and availability are not list filters on that API. The shim already had to filter those after the response.

## Considered Options

- Pass `ordering` (and Sources-shaped filter params) and treat a matching server order as a requirement
- Add `OrderingFilter` to Koku as part of this UI cut-in
- Load the OpenShift list (`name` and `type=OCP` on the request), then filter, sort, and page in `costSourcesApi.js`

## Decision Outcome

Chosen option: **sort and page in the shim**. The Cost API stays unchanged. The list walks pages up to 1000 rows, drops duplicate ids, applies the remaining filters, sorts, and slices the requested page. Type is sortable and every on-prem row is OpenShift, so that column does not visibly reorder. Connected applications and Status have no sort control in sources-ui.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because Name and Date added reorder without a Koku change.
- Bad, because a catalog larger than the fetch cap is only sorted inside that window. Server-side `ordering_fields` would replace this.
- Neutral, because name and `type=OCP` stay on the request. The other filters stay in the shim beside the sort.
