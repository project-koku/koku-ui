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

### Pointing to a local koku backend

For a local koku + nise stack (no OpenShift cluster), see [QUICK_START_KOKU.md](../../QUICK_START_KOKU.md). From the repo root:

```
npm run quick:start:koku:onprem
npm run start:quick:start:koku:onprem
```

The setup script is `scripts/onprem/quick-start-koku.sh`. Use `npm run quick:start:koku` / `npm run start:quick:start:koku` for SaaS-local providers against the same local API.

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
source scripts/onprem/setup-onprem-env.sh
```

This sets `API_PROXY_URL` and `API_TOKEN` (a short-lived token, used only as a
connectivity check) by auto-discovering cluster configuration. Discovery order:
(1) `CostManagementServiceConfig` if koku-service-operator is installed,
(2) `CostManagementMetricsConfig` CR if the CMMO operator is installed,
(3) `cost-onprem` Helm chart resources (gateway route + keycloak-debug ConfigMap + Keycloak secret).

### Pointing to a koku-service-operator deployment

From a cluster-admin `oc` login, install the operator (BYOI dependencies, in-cluster
manager, `CostManagementServiceConfig`) and ingest QE's IQE OpenShift source and
cost model:

```
npm run setup:operator
```

This clones [koku-service-operator](https://github.com/martinpovolny/koku-service-operator)
next to this repo if needed, uses the sibling `cost-onprem-chart` checkout for RHBK,
and follows the operator [pre-prod install](https://github.com/martinpovolny/koku-service-operator/blob/2f10a1beab3d9ab47431f89cfa26b0db8f94deba/docs/development/pre-prod-install.md)
and [UI development](https://github.com/martinpovolny/koku-service-operator/blob/2f10a1beab3d9ab47431f89cfa26b0db8f94deba/docs/development/ui-development.md)
guides. First run typically takes 20–40 minutes for the operator, then IQE
`test_data_setup_ocp_single` (source `test_cost_ocp_cluster_advanced`, cost model
in SEK). NISE monthly CSVs land in `nise-output/` (gitignored).

Then start the local UI (sources `scripts/onprem/setup-onprem-env.sh` so the RBAC remote
can reach the operator gateway):

```
npm run start:onprem:operator
```

Open **http://localhost:9002** and sign in as `admin` / `admin`, `viewer` / `viewer`
(non-org-admin with IAM read RBAC roles), or `rbac_user` / `rbac_user` (created by
QE's `setup_onprem_cluster.sh`).

#### `setup:operator` npm targets

All of these require `oc` login to the target cluster. Extra flags after `--` are
forwarded to `scripts/onprem/setup-operator.sh` or `scripts/onprem/setup-operator-iqe.sh`
depending on the target.

| Command | Use when |
|---|---|
| `npm run setup:operator` | **From scratch.** Install operator + BYOI, then IQE leftover-UI ingest. |
| `npm run setup:operator:install` | Operator stack only (API, UI, Keycloak). Overview stays empty until IQE. |
| `npm run setup:operator:reset` | Tear down namespaces/CR, reinstall, then IQE ingest. **Destructive.** |
| `npm run setup:operator:dry-run` | Preview the installer without changing the cluster. |
| `npm run setup:operator:sync-images` | Live CMSC is on an older koku image (no `sources` user-access type). Copies the koku tag from `cost-onprem-chart`. |
| `npm run setup:operator:iqe` | Operator already installed. IQE venv + `setup_onprem_cluster.sh` + leftover-UI ingest. |
| `npm run setup:operator:iqe:setup` | IQE venv + cluster setup only (`rbac_user`, masu `IQE_TEST_RUN`). |
| `npm run setup:operator:iqe:ingest` | IQE leftover-UI ingest only. Add `-- --smoke` for the PR smoke suite (that suite deletes sources after tests). |
| `npm run setup:operator:sync-users` | Re-sync Keycloak `admin`/`viewer` users and re-grant viewer IAM read RBAC roles. |

Environment overrides (optional): `NAMESPACE`, `CR_NAME`, `KEYCLOAK_NAMESPACE`,
`OPERATOR_DIR`, `CHART_ROOT`, `KOKU_IMAGE_TAG`, `IQE_CORE_PATH`, `IQE_PLUGIN_PATH`,
`NISE_OUTPUT_DIR`. See the header comments in `scripts/onprem/setup-operator.sh` and
`scripts/onprem/setup-operator-iqe.sh`.

IQE ingest uses `cost_skip_cleanup` so the source and cost model stay in the
cluster. Re-ingest:

```
npm run setup:operator:iqe:ingest
```

The chart script `cost-onprem-chart/scripts/setup-test-data.sh` is a richer NISE
generator for **Helm** installs (`{release}-gateway`, bundled Postgres). It does
not match operator BYOI resource names. Prefer IQE against a koku-service-operator
cluster.

### Starting the dev server

From the root of the repo, run

```
npm run start:onprem:auth
```

`start:onprem:auth` sources `scripts/onprem/setup-onprem-env.sh` (requires `oc` login; auto-discovers
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
default to **off**. HCCM on-prem webpack enables a set of Cost Management flags
by default; ROS does not.

To override (replace) the flag list for a build or local server, set a
comma-separated env before starting:

```
export ONPREM_UNLEASH_FLAGS=some.flag.name,another.flag
npm run start:onprem:auth
```

The host wraps the app in `FlagProvider` from the stub so federated remotes share the same context.

## Releasing Koku UI OnPrem

This [RELEASE][release-doc] doc describes how to release Koku UI OnPrem.

[Jira]: https://redhat.atlassian.net/projects/COST/
[Patternfly]: https://www.patternfly.org/
[release-doc]: https://github.com/project-koku/koku-ui/blob/main/apps/koku-ui-onprem/RELEASE.md

