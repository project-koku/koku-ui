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
npm run start:onprem
```

This script will run concurrent dev builds of hccm, ros and onprem applications.
After the successful build, navigate to http://localhost:9000


[Jira]: https://redhat.atlassian.net/projects/COST/
[Patternfly]: https://www.patternfly.org/
