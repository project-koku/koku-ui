#!/usr/bin/env bash
# Re-provision Keycloak realm users (admin/viewer) and org-admin role mappings.
# Safe to run against an existing operator or Helm install — does not redeploy RHBK.
#
# Usage (from koku-ui repo root):
#   npm run setup:operator:sync-users
#   KEYCLOAK_NAMESPACE=cost-keycloak npm run setup:operator:sync-users
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KOKU_UI_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPOS_DIR="$(cd "${KOKU_UI_DIR}/.." && pwd)"

OPERATOR_DIR="${OPERATOR_DIR:-${REPOS_DIR}/koku-service-operator}"
CHART_ROOT="${CHART_ROOT:-${REPOS_DIR}/cost-onprem-chart}"
NAMESPACE="${NAMESPACE:-cost-byoi}"
CR_NAME="${CR_NAME:-cost-management}"

if [[ -z "${KEYCLOAK_NAMESPACE:-}" ]]; then
  if oc get secret keycloak-client-secret-cost-management-operator -n keycloak >/dev/null 2>&1; then
    KEYCLOAK_NAMESPACE=keycloak
  elif oc get secret keycloak-client-secret-cost-management-operator -n cost-keycloak >/dev/null 2>&1; then
    KEYCLOAK_NAMESPACE=cost-keycloak
  else
    echo "Error: Keycloak namespace not found (tried keycloak, cost-keycloak)" >&2
    exit 1
  fi
fi

RHBK_SCRIPT="${RHBK_SCRIPT:-${OPERATOR_DIR}/scripts/deploy-rhbk.sh}"
if [[ ! -x "$RHBK_SCRIPT" ]]; then
  RHBK_SCRIPT="${CHART_ROOT}/scripts/deploy-rhbk.sh"
fi
[[ -x "$RHBK_SCRIPT" ]] || {
  echo "Error: deploy-rhbk.sh not found in operator or cost-onprem-chart checkout" >&2
  exit 1
}

# Operator installs use deploy-rhbk built-in defaults (admin+viewer). Pass VALUES_FILE
# explicitly only for Helm chart installs that customize jwtAuth.realmUsers.
VALUES_FILE="${VALUES_FILE:-}"

oc whoami >/dev/null 2>&1 || {
  echo "Error: not logged in — run oc login first" >&2
  exit 1
}

echo "Syncing Keycloak realm users (namespace=${KEYCLOAK_NAMESPACE}, app=${NAMESPACE}/${CR_NAME})"
(
  cd "$(dirname "$RHBK_SCRIPT")"
  export RHBK_NAMESPACE="$KEYCLOAK_NAMESPACE"
  export COST_MGMT_NAMESPACE="$NAMESPACE"
  export COST_MGMT_RELEASE_NAME="$CR_NAME"
  if [[ -n "$VALUES_FILE" ]]; then
    ./"$(basename "$RHBK_SCRIPT")" -f "$VALUES_FILE" sync-users
  else
    ./"$(basename "$RHBK_SCRIPT")" sync-users
  fi
)

echo ""
echo "Granting IAM read RBAC permissions to viewer..."
bash "${SCRIPT_DIR}/grant-viewer-rbac-permissions.sh"

echo ""
echo "Realm users synced. UI logins:"
echo "  admin / admin   (org-admin)"
echo "  viewer / viewer (non-org-admin, IAM read via RBAC roles)"
