# Koku UI OnPrem

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)

React.js app for Cost Management OnPrem.

User interface is based on [Patternfly].

Submit issues in [Jira].

## Requirements

* [NodeJS v20.15+][nodejs]
* [npm v10.8+][npm]

## Getting Started

1. Install requirements listed above.
2. Run `npm ci` to install all the dependencies.

## Building apps/koku-ui-onprem
```
npm run build
```

## Running apps/koku-ui-onprem

```
export API_PROXY_URL=<backend_url>
export API_TOKEN=<auth_token_for_backend>
```

### Pointing to the SaaS (console.redhat.com) backend

Download [ocm CLI](https://console.redhat.com/openshift/downloads)

```
ocm login --use-auth-code
export API_PROXY_URL=https://console.redhat.com/api/cost-management/v1
export API_TOKEN=$(ocm token)
```

### Pointing to an on-prem backend deployed on an OpenShift cluster

If you have a cost-onprem Helm chart deployment running on an OpenShift cluster,
log in with `oc` and source the helper script to auto-discover all required
environment variables:

```
oc login -s <cluster_api_url> -u <username> --password <password>
source scripts/setup-onprem-env.sh
```

This sets `API_PROXY_URL` and `API_TOKEN` from the cluster's
`CostManagementMetricsConfig` CR and Keycloak auth secret.

It also exports `KEYCLOAK_TOKEN_URL`, `KEYCLOAK_CLIENT_ID`, and
`KEYCLOAK_CLIENT_SECRET`, which enable **automatic token renewal** in the
dev server. Without these variables the proxy uses the static `API_TOKEN`
(which expires after a few minutes); with them, the proxy refreshes the
token in the background before it expires.

### Starting the dev server

From the root of the repo, run
```
npm run start:onprem:dev
```

`start:onprem:dev` sources `scripts/setup-onprem-env.sh` (requires `oc` login and a
`CostManagementMetricsConfig` CR on the cluster), then starts the full on-prem stack.
All remotes share `libs/onprem-cloud-deps` (feat shims; Unleash stub uses lazy init to avoid HCCM TDZ).

Equivalent manual flow:

```
source scripts/setup-onprem-env.sh
npm run start:onprem
```

This runs concurrent dev builds of the host, HCCM, ROS, Sources, and RBAC remotes.
After the successful build, navigate to http://localhost:9001

### RBAC IAM remote (FLPATH-4164)

| Item | Value |
|------|--------|
| Static assets | `/rbac/` (`apps/rbac-ui-onprem/dist`, webpack at image build; upstream from `vendor/insights-rbac-ui` submodule) |
| Federated scope | `insightsRbac` / module `./Iam` |
| Host route | `/iam/*` (POC entry: `/iam/my-user-access`) |
| API (dev proxy) | `/api/rbac` → gateway origin derived from `API_PROXY_URL` |

Production image: `apps/koku-ui-onprem/Containerfile` runs `build:onprem` for RBAC and copies `apps/rbac-ui-onprem/dist` to nginx `./rbac`.

### Cypress E2E

| Suite | Path | Command |
|-------|------|---------|
| Integration (mocked APIs) | [`cypress/e2e/integration/`](cypress/e2e/integration/) | `npm run test:cypress` |
| E2E (cluster-backed) | [`cypress/e2e/live/`](cypress/e2e/live/) | `npm run test:cypress:live` |

Live e2e is **not** run in CI. From koku-ui root: `npm run start:onprem:dev`, then `npm run test:cypress:live -w @koku-ui/koku-ui-onprem` (21 tests in `cypress/e2e/live/`). RBAC federated build: `npm run build:onprem -w @koku-ui/rbac-ui-onprem`.

Details: [`cypress/README.md`](cypress/README.md).

### Feature flags (Unleash stub)

On-prem uses `@koku-ui/onprem-cloud-deps` instead of a live Unleash proxy. All flags default to **off**.

To enable specific flags locally, set a comma-separated list before starting the dev server:

```
export ONPREM_UNLEASH_FLAGS=some.flag.name,another.flag
npm run start:onprem:dev
```

The host wraps the app in `FlagProvider` from the stub so federated remotes share the same context.


[Jira]: https://redhat.atlassian.net/projects/COST/
[Patternfly]: https://www.patternfly.org/
