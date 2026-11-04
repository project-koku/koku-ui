---
status: accepted
date: 2026-11-04
---

# Leave Manage connected applications upstream

## Context and Problem Statement

Manage connected applications is the upstream edit form. For a Cost Management application with no stored authentication and a non-empty cluster id, sources-ui adds a synthetic token authentication and disables Cluster Identifier. The helper text is "Value cannot be modified since it has been set using the API." Every current on-prem record is built that way: one Cost Management application, `authentications: []`, and `source_ref` from the cluster id. Save changes and Reset enable only when the form is dirty and valid, so they stay disabled.

`sources:*:*` was granted and the access API returned it. The field stayed disabled. Write permission chooses between the form and "Missing permissions." It does not clear the operator exception.

## Considered Options

- Replace the card with a read-only Cluster Identifier shim and hide Save and Reset
- Treat the grant as a reason to enable the field
- Keep the upstream card

## Decision Outcome

Chosen option: **keep the upstream card**. The disabled field is the same rule SaaS uses for an operator-managed OpenShift source, and every on-prem integration matches that case. The read-only shim was removed.

Do not add a hidden `authentication.authtype` field with `initialValue` to the OpenShift schema. Registering that nested value marks the edit form dirty and flashes Save and Reset. The wizard still sets the token type on its own step.

Related plan: [0007-onprem-federated-sources.md](../plans/0007-onprem-federated-sources.md).

### Consequences

- Good, because the detail form stays upstream and the disabled state is explainable.
- Bad, because the card looks inactive. That is the intended state for these records, not a missing role.
