# Koku UI OnPrem

[![Apache 2.0][license-badge]](https://github.com/project-koku/koku-ui/blob/main/LICENSE)

React.js app for Cost Management OnPrem.

User interface is based on [Patternfly].

Submit issues in [Jira].

## Requirements

* [NodeJS v22.20+][nodejs]
* [npm v11.6+][npm]

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

This sets `API_PROXY_URL` and `API_TOKEN` (a short-lived token, used only as a
connectivity check) by auto-discovering cluster configuration. Discovery order:
(1) `CostManagementMetricsConfig` CR if the CMMO operator is installed,
(2) `cost-onprem` Helm chart resources (gateway route + keycloak-debug ConfigMap + Keycloak secret).

### Starting the dev server

From the root of the repo, run

```
npm run start:onprem:auth
```

`start:onprem:auth` sources `scripts/setup-onprem-env.sh` (requires `oc` login; auto-discovers
API URL and Keycloak credentials from cluster resources), then starts the full on-prem stack
behind a local `oauth2-proxy` container so you sign in as a real user (real OIDC flow, session
expiry, logout redirect — see below). All remotes share `libs/onprem-cloud-deps` (feat shims;
Unleash stub uses lazy init to avoid HCCM TDZ).

> **Historical note:** an earlier `start:onprem:dev` mode kept a shared service-account token
> "hot" via a `TokenRefresher` library, opening the app pre-authenticated with no login screen.
> That workaround predated multi-tenancy support and was removed in COST-7903 — `start:onprem:auth`
> is now the only supported way to run the on-prem stack against a cluster locally.

### Auth enabled dev-mode — login screen, real sessions & logout (start:onprem:auth)

To test the login flow, session expiry, and the logout redirect, use the `start:onprem:auth` script:

```
npm run start:onprem:auth
```

**Prerequisites** (in addition to `oc` login):
- [Podman](https://podman.io/) or [Docker](https://www.docker.com/) with the daemon running.
  No binary installation of `oauth2-proxy` is needed — it runs as a container.

Then open **http://localhost:9002** (not 9001). You will be redirected to the Keycloak login page.

For a detailed walkthrough of how the auth flow works, how the script reads its configuration from the cluster, and troubleshooting tips, see **[docs/auth-enabled-dev-mode.md](docs/auth-enabled-dev-mode.md)**.

Optional port / namespace overrides:
```
ONPREM_AUTH_PORT=9002 ONPREM_UI_PORT=9001 npm run start:onprem:auth
```

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

Live e2e is **not** run in CI. From koku-ui root: `npm run start:onprem:auth`, then `npm run test:cypress:live -w @koku-ui/koku-ui-onprem` (21 tests in `cypress/e2e/live/`). RBAC federated build: `npm run build:onprem -w @koku-ui/rbac-ui-onprem`.

Details: [`cypress/README.md`](cypress/README.md).

### Feature flags (Unleash stub)

On-prem uses `@koku-ui/onprem-cloud-deps` instead of a live Unleash proxy. Flags
default to **off**, except ROS on-prem webpack defaults
`cost-management.koku-ui-ros.box-plot` so Optimizations utilization charts render
(COST-7658). That default lives only in
`apps/koku-ui-ros/webpack-onprem.config.ts`.

To override (replace) the flag list for a build or local server, set a
comma-separated env before starting:

```
export ONPREM_UNLEASH_FLAGS=some.flag.name,another.flag
npm run start:onprem:auth
```

The host wraps the app in `FlagProvider` from the stub so federated remotes share the same context.


[Jira]: https://redhat.atlassian.net/projects/COST/
[Patternfly]: https://www.patternfly.org/
