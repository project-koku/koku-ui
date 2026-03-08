#!/bin/bash
# Discovers Keycloak and Koku API configuration from the OpenShift cluster
# and exports environment variables for the on-prem UI dev server.
#
# Prerequisites: `oc` CLI installed (will prompt for login if needed)
#
# Usage:
#   source scripts/setup-onprem-env.sh            # auto-detect everything
#   source scripts/setup-onprem-env.sh my-ns      # specify the operator namespace
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
# Locate the CostManagementMetricsConfig CR
# ---------------------------------------------------------------------------

echo "Looking for CostManagementMetricsConfig CR..."

CMC_LINE=$(kubectl get costmanagementmetricsconfig -A --no-headers -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name' 2>/dev/null | head -1)

[[ -z "$CMC_LINE" ]] && _fail "no CostManagementMetricsConfig found on this cluster"

CMC_NS=$(echo "$CMC_LINE" | awk '{print $1}')
CMC_NAME=$(echo "$CMC_LINE" | awk '{print $2}')

echo "  Found: $CMC_NAME in namespace $CMC_NS"

# ---------------------------------------------------------------------------
# Extract values from the CR spec via jsonpath
# ---------------------------------------------------------------------------

API_URL=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
  -o jsonpath='{.spec.api_url}')
TOKEN_URL=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
  -o jsonpath='{.spec.authentication.token_url}')
SECRET_NAME=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
  -o jsonpath='{.spec.authentication.secret_name}')
SOURCES_PATH=$(kubectl get costmanagementmetricsconfig "$CMC_NAME" -n "$CMC_NS" \
  -o jsonpath='{.spec.source.sources_path}')
SOURCES_PATH="${SOURCES_PATH:-/api/cost-management/v1/}"

[[ -z "$API_URL" ]]    && _fail "spec.api_url is empty in $CMC_NAME"
[[ -z "$TOKEN_URL" ]]  && _fail "spec.authentication.token_url is empty in $CMC_NAME"
[[ -z "$SECRET_NAME" ]] && _fail "spec.authentication.secret_name is empty in $CMC_NAME"

# ---------------------------------------------------------------------------
# Read client credentials from the auth secret
# ---------------------------------------------------------------------------

echo "  Reading secret: $SECRET_NAME"

CLIENT_ID=$(kubectl get secret "$SECRET_NAME" -n "$CMC_NS" -o jsonpath='{.data.client_id}' | base64 -d)
CLIENT_SECRET=$(kubectl get secret "$SECRET_NAME" -n "$CMC_NS" -o jsonpath='{.data.client_secret}' | base64 -d)

[[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]] && _fail "could not read client_id/client_secret from secret $SECRET_NAME"

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
echo "  API_PROXY_URL        = $API_PROXY_URL"
echo "  KEYCLOAK_TOKEN_URL   = $KEYCLOAK_TOKEN_URL"
echo "  KEYCLOAK_CLIENT_ID   = $KEYCLOAK_CLIENT_ID"
echo "  KEYCLOAK_CLIENT_SECRET = ${KEYCLOAK_CLIENT_SECRET:0:4}****"
echo "  API_TOKEN            = ${ACCESS_TOKEN:0:20}..."
echo ""
echo "Run:  npm run start:onprem"
