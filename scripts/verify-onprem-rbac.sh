#!/usr/bin/env bash
# Pre-flight checks for rbac-ui-onprem federated remote (FLPATH-4164).
# Usage:
#   scripts/verify-onprem-rbac.sh              # full check (requires built dist)
#   scripts/verify-onprem-rbac.sh --require-entry-only  # only upstream install (prebuild)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RBAC_APP="$ROOT/apps/rbac-ui-onprem"
VERSION_FILE="$RBAC_APP/rbac-ui.version.json"
MANIFEST="$RBAC_APP/dist/plugin-manifest.json"
EXPECTED_SCOPE="insightsRbac"
EXPECTED_MODULE="./Iam"

REQUIRE_ENTRY_ONLY=false
if [[ "${1:-}" == "--require-entry-only" ]]; then
  REQUIRE_ENTRY_ONLY=true
fi

_fail() {
  echo "verify-onprem-rbac: $1" >&2
  exit 1
}

[[ -f "$VERSION_FILE" ]] || _fail "missing $VERSION_FILE"

PIN_REF="$(node -e "console.log(require('$VERSION_FILE').ref)")"
[[ -n "$PIN_REF" ]] || _fail "rbac-ui.version.json missing ref"

# Installed upstream package (from koku-ui root node_modules after npm ci)
RBAC_PKG_ROOT="$ROOT/node_modules/insights-rbac-frontend"
[[ -d "$RBAC_PKG_ROOT" ]] || _fail "insights-rbac-frontend not installed — run 'npm ci' at koku-ui root"

IAM_ENTRY="$RBAC_PKG_ROOT/src/federated-modules/Iam.tsx"
[[ -f "$IAM_ENTRY" ]] || _fail "upstream entry missing: $IAM_ENTRY (pin may not include sources)"

if [[ "$REQUIRE_ENTRY_ONLY" == true ]]; then
  echo "verify-onprem-rbac: OK (upstream entry present, ref=$PIN_REF)"
  exit 0
fi

[[ -f "$MANIFEST" ]] || _fail "missing $MANIFEST — run 'npm run build:onprem' from koku-ui root"

if command -v jq >/dev/null 2>&1; then
  ACTUAL_SCOPE="$(jq -r '.name // empty' "$MANIFEST")"
  [[ "$ACTUAL_SCOPE" == "$EXPECTED_SCOPE" ]] || _fail "manifest name=$ACTUAL_SCOPE expected $EXPECTED_SCOPE"

  BASE_URL="$(jq -r '.baseURL // empty' "$MANIFEST")"
  [[ "$BASE_URL" == "/rbac/" ]] || _fail "manifest baseURL=$BASE_URL expected /rbac/"

  # DynamicRemotePlugin may emit dist/exposed-./Iam.bundle-*.js or dist/exposed-./<chunk>.js (not always flat).
  if ! find "$RBAC_APP/dist" -name '*Iam.bundle*.js' -print -quit | grep -q .; then
    _fail "no federated bundle for $EXPECTED_MODULE under $RBAC_APP/dist"
  fi
  [[ -f "$RBAC_APP/dist/plugin-entry.js" ]] || _fail "missing plugin-entry.js in dist"
else
  echo "verify-onprem-rbac: warn: jq not found — skipping manifest field assertions"
  grep -q "$EXPECTED_SCOPE" "$MANIFEST" || _fail "manifest does not mention scope $EXPECTED_SCOPE"
  find "$RBAC_APP/dist" -name '*Iam.bundle*.js' -print -quit | grep -q . || _fail "no exposed-Iam bundle in dist"
  [[ -f "$RBAC_APP/dist/plugin-entry.js" ]] || _fail "missing plugin-entry.js in dist"
fi

echo "verify-onprem-rbac: OK (manifest + upstream ref=$PIN_REF)"
