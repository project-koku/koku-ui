#!/usr/bin/env bash
# Grant Sources administrator (Cloud administrator / sources:*:*) to admin and viewer.
#
# Usage (from koku-ui repo root):
#   bash scripts/onprem/grant-cloud-administrator-role.sh
#   npm run setup:operator:sync-users   # also runs this after Keycloak sync
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

NAMESPACE="${NAMESPACE:-cost-byoi}"
CR_NAME="${CR_NAME:-cost-management}"
RBAC_DEPLOY="${RBAC_DEPLOY:-${CR_NAME}-rbac-api}"

oc whoami >/dev/null 2>&1 || {
  echo "Error: not logged in — run oc login first" >&2
  exit 1
}

oc get deployment "$RBAC_DEPLOY" -n "$NAMESPACE" >/dev/null 2>&1 || {
  echo "Error: deployment ${NAMESPACE}/${RBAC_DEPLOY} not found" >&2
  exit 1
}

echo "Granting Cloud administrator (sources:*:*) to admin and viewer (namespace=${NAMESPACE})"
oc exec -i -n "$NAMESPACE" "deployment/${RBAC_DEPLOY}" -- \
  python manage.py shell < "${SCRIPT_DIR}/onprem_grant_cloud_administrator_role.py"

echo "  admin / admin and viewer / viewer now have Sources administrator (Cloud administrator)"
