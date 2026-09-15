#!/bin/bash
# Discovers Keycloak and Koku API configuration from the OpenShift cluster
# and exports environment variables for the on-prem UI dev server.
#
# Prerequisites: `oc` CLI installed (will prompt for login if needed)
#
# Discovery order (`ONPREM_BACKEND=auto`, the default):
#   1. CostManagementServiceConfig CR (koku-service-operator)
#   2. CostManagementMetricsConfig CR (CMMO operator, if installed)
#   3. cost-onprem Helm chart resources (route + keycloak-debug CM + keycloak secret)
#
# Force a backend with ONPREM_BACKEND=operator|helm|cmmo.
#
# Usage:
#   source scripts/onprem/setup-onprem-env.sh            # auto-detect everything
#   source scripts/onprem/setup-onprem-env.sh my-ns      # override cost namespace
#   ONPREM_BACKEND=operator source scripts/onprem/setup-onprem-env.sh
#
# Then run:
#   npm run start:onprem:auth          # Helm chart
#   npm run start:onprem:operator      # koku-service-operator

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

ONPREM_BACKEND="${ONPREM_BACKEND:-auto}"
NS_OVERRIDE="${1:-}"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_first_cmsc_line() {
  kubectl get costmanagementserviceconfig -A --no-headers \
    -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name' 2>/dev/null \
    | head -1 | xargs 2>/dev/null || true
}

_cmsc_in_ns() {
  local ns="$1"
  kubectl get costmanagementserviceconfig -n "$ns" --no-headers \
    -o custom-columns='NAME:.metadata.name' 2>/dev/null \
    | head -1 | xargs 2>/dev/null || true
}

_parse_keycloak_ns_from_url() {
  # http://keycloak-service.keycloak.svc.cluster.local:8080 → keycloak
  local url="$1"
  local host="${url#*://}"
  host="${host%%/*}"
  host="${host%%:*}"
  # keycloak-service.<ns>.svc.cluster.local
  local ns
  ns="$(echo "$host" | awk -F. '{
    for (i = 1; i <= NF; i++) if ($i == "svc") { print $(i-1); exit }
  }')"
  echo "$ns"
}

_token_url_from_issuer() {
  local issuer="$1"
  local realm="$2"
  issuer="${issuer%/}"
  if [[ "$issuer" == *"/realms/"* ]]; then
    echo "${issuer}/protocol/openid-connect/token"
  else
    echo "${issuer}/realms/${realm}/protocol/openid-connect/token"
  fi
}

_read_operator_client_secret() {
  local kc_ns="$1"
  local secret_name="keycloak-client-secret-cost-management-operator"
  echo "  Reading secret: $secret_name (ns: $kc_ns)"
  CLIENT_ID=$(oc get secret "$secret_name" -n "$kc_ns" \
    -o jsonpath='{.data.CLIENT_ID}' 2>/dev/null | base64 -d || true)
  CLIENT_SECRET=$(oc get secret "$secret_name" -n "$kc_ns" \
    -o jsonpath='{.data.CLIENT_SECRET}' 2>/dev/null | base64 -d || true)
  [[ -n "$CLIENT_ID" && -n "$CLIENT_SECRET" ]] || \
    _fail "could not read CLIENT_ID/CLIENT_SECRET from secret $secret_name in $kc_ns"
}

# ---------------------------------------------------------------------------
# Strategy: koku-service-operator (CostManagementServiceConfig)
# ---------------------------------------------------------------------------

_setup_operator() {
  local ns name line
  echo "Looking for CostManagementServiceConfig CR..."

  if [[ -n "$NS_OVERRIDE" ]]; then
    ns="$NS_OVERRIDE"
    name="$(_cmsc_in_ns "$ns")"
    [[ -n "$name" ]] || _fail "CostManagementServiceConfig not found in namespace $ns"
  else
    line="$(_first_cmsc_line)"
    [[ -n "$line" ]] || _fail "no CostManagementServiceConfig found — run: npm run setup:operator:install"
    ns=$(echo "$line" | awk '{print $1}')
    name=$(echo "$line" | awk '{print $2}')
  fi

  echo "  Found: $name in namespace $ns"

  local route_name="${name}-api"
  local route_host
  route_host=$(oc get route "$route_name" -n "$ns" -o jsonpath='{.spec.host}' 2>/dev/null || true)
  [[ -n "$route_host" ]] || _fail "route $route_name not found in namespace $ns"
  API_URL="https://${route_host}"
  SOURCES_PATH="/api/cost-management/v1/"

  local issuer realm kc_url
  issuer=$(kubectl get costmanagementserviceconfig "$name" -n "$ns" \
    -o jsonpath='{.spec.auth.keycloak.issuerURL}' 2>/dev/null || true)
  realm=$(kubectl get costmanagementserviceconfig "$name" -n "$ns" \
    -o jsonpath='{.spec.auth.keycloak.realm}' 2>/dev/null || true)
  realm="${realm:-kubernetes}"
  kc_url=$(kubectl get costmanagementserviceconfig "$name" -n "$ns" \
    -o jsonpath='{.spec.auth.keycloak.url}' 2>/dev/null || true)

  local kc_ns="${KEYCLOAK_NAMESPACE:-}"
  if [[ -z "$kc_ns" && -n "$kc_url" ]]; then
    kc_ns="$(_parse_keycloak_ns_from_url "$kc_url")"
  fi
  if [[ -z "$kc_ns" ]]; then
    if oc get secret keycloak-client-secret-cost-management-operator -n keycloak >/dev/null 2>&1; then
      kc_ns=keycloak
    elif oc get secret keycloak-client-secret-cost-management-operator -n cost-keycloak >/dev/null 2>&1; then
      kc_ns=cost-keycloak
    else
      kc_ns=keycloak
    fi
  fi

  if [[ -z "$issuer" ]]; then
    local kc_host
    kc_host=$(oc get route keycloak -n "$kc_ns" -o jsonpath='{.spec.host}' 2>/dev/null || true)
    [[ -n "$kc_host" ]] || _fail "spec.auth.keycloak.issuerURL is empty and Keycloak route was not found in $kc_ns"
    issuer="https://${kc_host}/realms/${realm}"
  fi

  TOKEN_URL="$(_token_url_from_issuer "$issuer" "$realm")"
  _read_operator_client_secret "$kc_ns"

  COST_NAMESPACE="$ns"
  COST_UI_DEPLOYMENT="${name}-ui"
  KEYCLOAK_NAMESPACE="$kc_ns"
  CR_NAME="$name"
  ONPREM_BACKEND=operator
}

# ---------------------------------------------------------------------------
# Strategy: CostManagementMetricsConfig CR (CMMO operator)
# ---------------------------------------------------------------------------

_setup_cmmo() {
  echo "Looking for CostManagementMetricsConfig CR..."

  local cmc_line cmc_ns cmc_name
  cmc_line=$(kubectl get costmanagementmetricsconfig -A --no-headers \
    -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name' 2>/dev/null || true)
  cmc_line=$(echo "$cmc_line" | head -1 | xargs 2>/dev/null || true)
  [[ -n "$cmc_line" ]] || return 1

  cmc_ns=$(echo "$cmc_line" | awk '{print $1}')
  cmc_name=$(echo "$cmc_line" | awk '{print $2}')
  echo "  Found: $cmc_name in namespace $cmc_ns"

  API_URL=$(kubectl get costmanagementmetricsconfig "$cmc_name" -n "$cmc_ns" \
    -o jsonpath='{.spec.api_url}')
  TOKEN_URL=$(kubectl get costmanagementmetricsconfig "$cmc_name" -n "$cmc_ns" \
    -o jsonpath='{.spec.authentication.token_url}')
  local secret_name
  secret_name=$(kubectl get costmanagementmetricsconfig "$cmc_name" -n "$cmc_ns" \
    -o jsonpath='{.spec.authentication.secret_name}')
  SOURCES_PATH=$(kubectl get costmanagementmetricsconfig "$cmc_name" -n "$cmc_ns" \
    -o jsonpath='{.spec.source.sources_path}')
  SOURCES_PATH="${SOURCES_PATH:-/api/cost-management/v1/}"

  [[ -z "$API_URL" ]]     && _fail "spec.api_url is empty in $cmc_name"
  [[ -z "$TOKEN_URL" ]]   && _fail "spec.authentication.token_url is empty in $cmc_name"
  [[ -z "$secret_name" ]] && _fail "spec.authentication.secret_name is empty in $cmc_name"

  echo "  Reading secret: $secret_name"
  CLIENT_ID=$(kubectl get secret "$secret_name" -n "$cmc_ns" \
    -o jsonpath='{.data.client_id}' | base64 -d)
  CLIENT_SECRET=$(kubectl get secret "$secret_name" -n "$cmc_ns" \
    -o jsonpath='{.data.client_secret}' | base64 -d)
  [[ -z "$CLIENT_ID" || -z "$CLIENT_SECRET" ]] && \
    _fail "could not read client_id/client_secret from secret $secret_name"

  COST_NAMESPACE="$cmc_ns"
  COST_UI_DEPLOYMENT="${COST_UI_DEPLOYMENT:-cost-onprem-ui}"
  KEYCLOAK_NAMESPACE="${KEYCLOAK_NAMESPACE:-keycloak}"
  ONPREM_BACKEND=cmmo
  return 0
}

# ---------------------------------------------------------------------------
# Strategy: cost-onprem Helm chart resources
# ---------------------------------------------------------------------------

_setup_helm() {
  echo "Using cost-onprem Helm chart resources"
  local helm_ns="${NS_OVERRIDE:-cost-onprem}"

  local route_host
  route_host=$(oc get route cost-onprem-api -n "$helm_ns" \
    -o jsonpath='{.spec.host}' 2>/dev/null || true)
  [[ -z "$route_host" ]] && _fail "route cost-onprem-api not found in namespace $helm_ns"
  API_URL="https://${route_host}"
  SOURCES_PATH="/api/cost-management/v1/"

  local kc_debug_data
  kc_debug_data=$(oc get cm cost-onprem-keycloak-debug -n "$helm_ns" \
    -o jsonpath='{.data.keycloak-detection-results\.yaml}' 2>/dev/null || true)
  [[ -z "$kc_debug_data" ]] && \
    _fail "configmap cost-onprem-keycloak-debug not found in $helm_ns"

  local issuer_url
  issuer_url=$(echo "$kc_debug_data" | grep 'issuer_url:' | awk '{print $2}' | tr -d '"\r')
  [[ -z "$issuer_url" ]] && _fail "issuer_url not found in cost-onprem-keycloak-debug"
  TOKEN_URL="${issuer_url}/protocol/openid-connect/token"

  local kc_ns
  kc_ns=$(echo "$kc_debug_data" | grep 'keycloak_namespace:' | awk '{print $2}' | tr -d '"\r')
  kc_ns="${kc_ns:-keycloak}"

  _read_operator_client_secret "$kc_ns"

  COST_NAMESPACE="$helm_ns"
  COST_UI_DEPLOYMENT="cost-onprem-ui"
  KEYCLOAK_NAMESPACE="$kc_ns"
  ONPREM_BACKEND=helm
}

# ---------------------------------------------------------------------------
# Select backend
# ---------------------------------------------------------------------------

case "$ONPREM_BACKEND" in
  operator)
    _setup_operator
    ;;
  helm)
    _setup_helm
    ;;
  cmmo)
    _setup_cmmo || _fail "CostManagementMetricsConfig CR not found"
    ;;
  auto)
    if [[ -n "$NS_OVERRIDE" ]] && [[ -n "$(_cmsc_in_ns "$NS_OVERRIDE")" ]]; then
      _setup_operator
    elif [[ -n "$(_first_cmsc_line)" ]]; then
      _setup_operator
    elif ! _setup_cmmo; then
      echo "  Not found — falling back to cost-onprem Helm chart resources"
      _setup_helm
    fi
    ;;
  *)
    _fail "ONPREM_BACKEND must be auto|operator|helm|cmmo (got ${ONPREM_BACKEND})"
    ;;
esac

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
export KEYCLOAK_NAMESPACE
export COST_NAMESPACE
export COST_UI_DEPLOYMENT
export ONPREM_BACKEND
export CR_NAME="${CR_NAME:-}"

echo ""
echo "Environment configured (${ONPREM_BACKEND}):"
echo "  API_PROXY_URL          = $API_PROXY_URL"
echo "  KEYCLOAK_TOKEN_URL     = $KEYCLOAK_TOKEN_URL"
echo "  KEYCLOAK_CLIENT_ID     = $KEYCLOAK_CLIENT_ID"
echo "  KEYCLOAK_CLIENT_SECRET = ${KEYCLOAK_CLIENT_SECRET:0:4}****"
echo "  KEYCLOAK_NAMESPACE     = $KEYCLOAK_NAMESPACE"
echo "  COST_NAMESPACE         = $COST_NAMESPACE"
echo "  COST_UI_DEPLOYMENT     = $COST_UI_DEPLOYMENT"
echo "  API_TOKEN              = ${ACCESS_TOKEN:0:20}..."
echo ""
echo "Run:  npm run start:onprem:auth   # Helm"
echo "      npm run start:onprem:operator   # koku-service-operator"
