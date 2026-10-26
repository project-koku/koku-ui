#!/usr/bin/env bash
# Grant sources:*:read to the Keycloak viewer lab user (viewer / viewer).
# This opens Cost Management Settings. It does not grant Cloud administrator.
#
# Usage (from koku-ui repo root):
#   bash scripts/onprem/grant-viewer-sources-role.sh
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

echo "Granting sources read (sources:*:read) to viewer (namespace=${NAMESPACE})"
oc exec -i -n "$NAMESPACE" "deployment/${RBAC_DEPLOY}" -- \
  python manage.py shell < "${SCRIPT_DIR}/onprem_grant_viewer_sources_role.py"

echo "  viewer / viewer has sources:*:read"
