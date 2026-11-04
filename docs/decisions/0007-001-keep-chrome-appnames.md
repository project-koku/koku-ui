---
status: accepted
date: 2026-11-04
---

# Keep the Chrome appnames

## Context and Problem Statement

Local Cost Management and ROS are registered with Insights appnames `cost-management` and `cost-management-ros`. Chrome's `jsVarName` turns those into module ids `costManagement` and `costManagementRos`. A local dev server proxies unmatched `/apps/...` routes to stage. Renaming the appname to `koku-ui-hccm` would make the module id `kokuUiHccm`.

## Considered Options

- Rename `package.json` `appname`, `frontend.yaml` `metadata.name`, paths, and `manifestLocation` together, and drop the old Chrome key
- Leave the Chrome registration and the appnames as they are

## Decision Outcome

Chosen option: **leave the registration and the appnames**. Stage still serves the `costManagement` and `costManagementRos` entries. The local frontend interceptor overwrites a module only when the registry key matches. A renamed key is added beside stage's entry, so the UI keeps loading stage's bundle. A dashed module id is valid CSS, but it fights the wrapper class Chrome derives from `jsVarName`.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because local UI and stage keep one module id.
- Bad, because a later rename has to change chrome-service and app-interface in the same cut, and remove the old key. The UI repo alone cannot do it.
