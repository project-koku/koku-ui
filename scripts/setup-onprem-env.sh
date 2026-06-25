#!/bin/bash
# Discovers Keycloak and Koku API configuration from the OpenShift cluster
# and exports environment variables for the on-prem UI dev server.
#
# Prerequisites: `oc` CLI installed (will prompt for login if needed)
#
# Discovery order:
#   1. CostManagementMetricsConfig CR (CMMO operator, if installed)
#   2. cost-onprem Helm chart resources (route + keycloak-debug CM + keycloak secret)
#
# Usage:
#   source scripts/setup-onprem-env.sh            # auto-detect everything
#   source scripts/setup-onprem-env.sh my-ns      # override cost-onprem namespace
#
# Then run:
#   npm run start:onprem

set -euo pipefail

_fail() { echo "Error: $1" >&2; return 1 2>/dev/null || exit 1; }

# ---------------------------------------------------------------------------
# Ensure the user is logged in to the cluster
# ---------------------------------------------------------------------------

if ! oc whoami &>/dev/null; then
  echo "Not logged in to an OpenShift cluster. Opening browser login..."
  oc login -w || _fail "cluster login failed — cannot continue without a session"
fi

echo "Logged in as $(oc whoami) on $(oc whoami --show-server)"

# ---------------------------------------------------------------------------
# Strategy 1: CostManagementMetricsConfig CR (CMMO operator)
# ---------------------------------------------------------------------------

echo "Looking for CostManagementMetricsConfig CR..."

CMC_LINE=$(kubectl get costmanagementmetricsconfig -A --no-headers \
  -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name' 2>/dev/null || true)
CMC_LINE=$(echo "$CMC_LINE" | head -1 | xargs 2>/dev/null || true)

if [[ -n "$CMC_LINE" ]]; then
  CMC_NS=$(echo "$CMC_LINE" | awk '{print $1}')
  CMC_NAME=$(echo "$CMC_LINE" | awk '{print $2}')
  echo "  Found: $CMC_NAME in namespace $CMC_NS"

  API_URL=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
    -o jsonpath='{.spec.api_url}')
  TOKEN_URL=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
    -o jsonpath='{.spec.authentication.token_url}')
  SECRET_NAME=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
    -o jsonpath='{.spec.authentication.secret_name}')
  SOURCES_PATH=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
    -o jsonpath='{.spec.source.sources_path}')
  SOURCES_PATH="${SOURCES_PATH:-/api/cost-management/v1/}"

  [[ -z "$API_URL" ]]     && _fail "spec.api_url is empty in $CMC_NAME"
  [[ -z "$TOKEN_URL" ]]   && _fail "spec.authentication.token_url is empty in $CMC_NAME"
  [[ -z "$SECRET_NAME" ]] && _fail "spec.authentication.secret_name is empty in $CMC_NAME"

  echo "  Reading secret: $SECRET_NAME"
  CLIENT_ID=$(kubectl get secret "$SECRET_NAME" -n "$CMC_NS" \
    -o jsonpath='{.data.client_id}' | base64 -d)
  CLIENT_SECRET=$(kubectl get secret "$SECRET_NAME" -n "$CMC_NS" \
    -o jsonpath='{.data.client_secret}' | base64 -d)
  [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]] && \
    _fail "could not read client_id/client_secret from secret $SECRET_NAME"

else
  # ---------------------------------------------------------------------------
  # Strategy 2: cost-onprem Helm chart resources (always present after chart install)
  # ---------------------------------------------------------------------------

  echo "  Not found — falling back to cost-onprem Helm chart resources"
  HELM_NS="${1:-cost-onprem}"

  # API URL from the gateway route
  ROUTE_HOST=$(oc get route cost-onprem-api -n "$HELM_NS" \
    -o jsonpath='{.spec.host}' 2>/dev/null || true)
  [[ -z "$ROUTE_HOST" ]] && _fail "route cost-onprem-api not found in namespace $HELM_NS"
  API_URL="https://${ROUTE_HOST}"
  SOURCES_PATH="/api/cost-management/v1/"

  # Token URL from keycloak-debug configmap (written by the Helm chart)
  KC_DEBUG_DATA=$(oc get cm cost-onprem-keycloak-debug -n "$HELM_NS" \
    -o jsonpath='{.data.keycloak-detection-results\.yaml}' 2>/dev/null || true)
  [[ -z "$KC_DEBUG_DATA" ]] && \
    _fail "configmap cost-onprem-keycloak-debug not found in $HELM_NS"

  ISSUER_URL=$(echo "$KC_DEBUG_DATA" | grep 'issuer_url:' | awk '{print $2}' | tr -d '"\r')
  [[ -z "$ISSUER_URL" ]] && _fail "issuer_url not found in cost-onprem-keycloak-debug"
  TOKEN_URL="${ISSUER_URL}/protocol/openid-connect/token"

  # Keycloak namespace and client credentials
  KC_NS=$(echo "$KC_DEBUG_DATA" | grep 'keycloak_namespace:' | awk '{print $2}' | tr -d '"\r')
  KC_NS="${KC_NS:-keycloak}"
  SECRET_NAME="keycloak-client-secret-cost-management-operator"

  echo "  Reading secret: $SECRET_NAME (ns: $KC_NS)"
  CLIENT_ID=$(oc get secret "$SECRET_NAME" -n "$KC_NS" \
    -o jsonpath='{.data.CLIENT_ID}' 2>/dev/null | base64 -d || true)
  CLIENT_SECRET=$(oc get secret "$SECRET_NAME" -n "$KC_NS" \
    -o jsonpath='{.data.CLIENT_SECRET}' 2>/dev/null | base64 -d || true)
  [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]] && \
    _fail "could not read CLIENT_ID/CLIENT_SECRET from secret $SECRET_NAME in $KC_NS"
fi

# ---------------------------------------------------------------------------
# Build API_PROXY_URL
# ---------------------------------------------------------------------------

API_URL_CLEAN="${API_URL%/}"
SOURCES_PATH_CLEAN="${SOURCES_PATH#/}"
PROXY_URL="${API_URL_CLEAN}/${SOURCES_PATH_CLEAN%/}"

# ---------------------------------------------------------------------------
# Fetch an initial token to validate connectivity
# ---------------------------------------------------------------------------

echo "  Validating Keycloak connectivity..."

# -k is needed because dev/lab clusters typically use self-signed certificates
ACCESS_TOKEN=$(curl -sk -X POST "$TOKEN_URL" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  | jq -r '.access_token // empty' 2>/dev/null) || true

if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "  Warning: could not obtain a token from Keycloak." >&2
  echo "  Token URL: $TOKEN_URL" >&2
  echo "  The dev server will start but API calls will fail until a token is available." >&2
else
  TOKEN_EXP=$(node -e "
    const token = process.argv[1];
    try {
      const payload = Buffer.from(token.split('.')[1], 'base64url').toString();
      const exp = JSON.parse(payload).exp;
      console.log(new Date(exp * 1000).toTimeString().slice(0, 8));
    } catch { console.log('unknown'); }
  " "$ACCESS_TOKEN" 2>/dev/null) || true
  echo "  Token obtained (expires at ${TOKEN_EXP:-unknown})"
fi

# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------

export API_PROXY_URL="$PROXY_URL"
export API_TOKEN="$ACCESS_TOKEN"
export KEYCLOAK_TOKEN_URL="$TOKEN_URL"
export KEYCLOAK_CLIENT_ID="$CLIENT_ID"
export KEYCLOAK_CLIENT_SECRET="$CLIENT_SECRET"

echo ""
echo "Environment configured:"
echo "  API_PROXY_URL          = $API_PROXY_URL"
echo "  KEYCLOAK_TOKEN_URL     = $KEYCLOAK_TOKEN_URL"
echo "  KEYCLOAK_CLIENT_ID     = $KEYCLOAK_CLIENT_ID"
echo "  KEYCLOAK_CLIENT_SECRET = ${KEYCLOAK_CLIENT_SECRET:0:4}****"
echo "  API_TOKEN              = ${ACCESS_TOKEN:0:20}..."
echo ""
echo "Run:  npm run start:onprem"
