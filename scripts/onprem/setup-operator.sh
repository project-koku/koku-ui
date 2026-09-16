#!/usr/bin/env bash
# ============================================================
# setup-operator.sh
# ============================================================
#
# Installs koku-service-operator (BYOI + in-cluster manager +
# CostManagementServiceConfig) on the OpenShift cluster you are
# currently logged into. Test data comes from IQE
# (npm run setup:operator:iqe), not from this script.
#
# Follows:
#   https://github.com/martinpovolny/koku-service-operator/blob/2f10a1beab3d9ab47431f89cfa26b0db8f94deba/docs/development/pre-prod-install.md
#   https://github.com/martinpovolny/koku-service-operator/blob/2f10a1beab3d9ab47431f89cfa26b0db8f94deba/docs/development/ui-development.md
#
# Usage (from koku-ui repo root):
#   npm run setup:operator                 # install + IQE ingest (from scratch)
#   npm run setup:operator:install         # operator stack only (empty UI until IQE)
#   npm run setup:operator:reset           # tear down, reinstall, then IQE ingest
#   npm run setup:operator:dry-run         # preview the installer without changing the cluster
#   npm run setup:operator:sync-images     # bump CMSC koku/masu tags from cost-onprem-chart
#   npm run setup:operator:iqe             # IQE cluster setup + leftover-UI ingest
#
# After install + IQE:
#   npm run start:onprem:operator
#
# Environment overrides:
#   OPERATOR_DIR     Checkout of koku-service-operator (default: ../koku-service-operator)
#   OPERATOR_REPO    Git remote (default: martinpovolny/koku-service-operator)
#   OPERATOR_REF     Git commit / tag / branch to check out when cloning
#   CHART_ROOT       cost-onprem-chart checkout (default: ../cost-onprem-chart)
#   NAMESPACE        CR + operator namespace (default: cost-byoi)
#   CR_NAME          CostManagementServiceConfig name (default: cost-management)
#   INFRA_NAMESPACE  Postgres / Valkey / MinIO (default: cost-byoi-infra)
#   KAFKA_NAMESPACE  AMQ Streams (default: kafka)
#   KEYCLOAK_NAMESPACE  RHBK (default: keycloak, or cost-keycloak if workshop SSO occupies keycloak)
#   KOKU_IMAGE_TAG   Override chart koku tag for CMSC api + masu (default: chart values.yaml)
#   KUBE_CONTEXT     Pin oc/kubectl context (default: current context)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KOKU_UI_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPOS_DIR="$(cd "${KOKU_UI_DIR}/.." && pwd)"

OPERATOR_REPO="${OPERATOR_REPO:-https://github.com/martinpovolny/koku-service-operator.git}"
OPERATOR_REF="${OPERATOR_REF:-2f10a1beab3d9ab47431f89cfa26b0db8f94deba}"
OPERATOR_DIR="${OPERATOR_DIR:-${REPOS_DIR}/koku-service-operator}"
CHART_ROOT="${CHART_ROOT:-${REPOS_DIR}/cost-onprem-chart}"

NAMESPACE="${NAMESPACE:-cost-byoi}"
CR_NAME="${CR_NAME:-cost-management}"
INFRA_NAMESPACE="${INFRA_NAMESPACE:-cost-byoi-infra}"
KAFKA_NAMESPACE="${KAFKA_NAMESPACE:-kafka}"

DEMO_RESET=0
SYNC_IMAGES_ONLY=0
DEMO_DRY_RUN=0

if [[ -t 1 ]]; then
  C_BOLD="$(tput bold 2>/dev/null || true)"
  C_CYAN="$(tput setaf 6 2>/dev/null || true)"
  C_GREEN="$(tput setaf 2 2>/dev/null || true)"
  C_YELLOW="$(tput setaf 3 2>/dev/null || true)"
  C_RED="$(tput setaf 1 2>/dev/null || true)"
  C_RESET="$(tput sgr0 2>/dev/null || true)"
else
  C_BOLD="" C_CYAN="" C_GREEN="" C_YELLOW="" C_RED="" C_RESET=""
fi

log() { echo "${C_CYAN}▶ $*${C_RESET}"; }
ok() { echo "${C_GREEN}  ✔ $*${C_RESET}"; }
warn() { echo "${C_YELLOW}  ⚠ $*${C_RESET}"; }
fail() {
  echo "${C_BOLD}${C_RED}✖ Error: $*${C_RESET}" >&2
  exit 1
}

usage() {
  sed -n '2,42p' "$0" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reset) DEMO_RESET=1; shift ;;
    --dry-run) DEMO_DRY_RUN=1; shift ;;
    --sync-images) SYNC_IMAGES_ONLY=1; shift ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown flag: $1 (try --help)"
      ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "required command not found: $1"
}

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------

need_cmd oc
need_cmd git
need_cmd python3
need_cmd openssl
need_cmd jq

if ! oc whoami >/dev/null 2>&1; then
  echo "Not logged in to an OpenShift cluster. Opening browser login..."
  oc login -w || fail "cluster login failed — cannot continue without a session"
fi

KUBE_CONTEXT="${KUBE_CONTEXT:-$(oc config current-context)}"
oc config use-context "$KUBE_CONTEXT" >/dev/null
ok "logged in as $(oc whoami) on $(oc whoami --show-server)"
ok "kube context: ${KUBE_CONTEXT}"

# ---------------------------------------------------------------------------
# Keycloak namespace: do not hijack a workshop SSO already in "keycloak"
# ---------------------------------------------------------------------------

pick_keycloak_namespace() {
  if [[ -n "${KEYCLOAK_NAMESPACE:-}" ]]; then
    return 0
  fi
  local ns
  for ns in keycloak cost-keycloak; do
    if oc get secret keycloak-client-secret-cost-management-ui -n "$ns" >/dev/null 2>&1; then
      KEYCLOAK_NAMESPACE="$ns"
      ok "reusing Cost Management Keycloak clients in namespace ${ns}"
      return 0
    fi
  done
  if oc get ns keycloak >/dev/null 2>&1; then
    if oc get keycloakrealmimport sso -n keycloak >/dev/null 2>&1 \
      || oc get route keycloak -n keycloak -o jsonpath='{.spec.host}' 2>/dev/null | grep -q '^sso\.'; then
      KEYCLOAK_NAMESPACE=cost-keycloak
      warn "namespace 'keycloak' already has workshop SSO — deploying Cost RHBK to ${KEYCLOAK_NAMESPACE}"
      return 0
    fi
  fi
  KEYCLOAK_NAMESPACE=keycloak
}

pick_keycloak_namespace
ok "KEYCLOAK_NAMESPACE=${KEYCLOAK_NAMESPACE}"

# ---------------------------------------------------------------------------
# Operator + chart checkouts
# ---------------------------------------------------------------------------

ensure_operator_checkout() {
  if [[ -d "${OPERATOR_DIR}/.git" ]]; then
    ok "using existing operator checkout: ${OPERATOR_DIR}"
    return 0
  fi
  log "cloning koku-service-operator → ${OPERATOR_DIR}"
  git clone "$OPERATOR_REPO" "$OPERATOR_DIR"
  git -C "$OPERATOR_DIR" checkout --detach "$OPERATOR_REF"
  ok "checked out ${OPERATOR_REF}"
}

ensure_operator_checkout

# Docker Hub denies anonymous pulls of minio/minio and minio/mc on typical
# OpenShift clusters (postgres/valkey from docker.io still work). Point BYOI
# MinIO at quay.io so deploy-byoi.sh can roll out object storage.
patch_byoi_minio_images() {
  local f="${OPERATOR_DIR}/config/samples/byoi/infra/minio.yaml"
  [[ -f "$f" ]] || fail "MinIO fixture not found: $f"
  if grep -q 'image: docker.io/minio/' "$f"; then
    local tmp
    tmp="$(mktemp)"
    sed \
      -e 's|image: docker.io/minio/minio:|image: quay.io/minio/minio:|' \
      -e 's|image: docker.io/minio/mc:|image: quay.io/minio/mc:|' \
      "$f" >"$tmp"
    mv "$tmp" "$f"
    ok "rewrote BYOI MinIO images to quay.io (Docker Hub anonymous pull denied)"
  else
    ok "BYOI MinIO images already use a non-docker.io registry"
  fi
}

# deploy-byoi.sh's EXIT trap returns 1 when SKIP_INFRA=1 (TMP_INFRA is empty),
# and with `set -e` that becomes the script's exit status after a successful run.
patch_byoi_cleanup_trap() {
  local f="${OPERATOR_DIR}/hack/deploy-byoi.sh"
  [[ -f "$f" ]] || fail "deploy-byoi.sh not found: $f"
  if grep -q 'return 0  # koku-ui setup-operator' "$f"; then
    ok "deploy-byoi.sh EXIT trap already patched"
    return 0
  fi
  local tmp
  tmp="$(mktemp)"
  python3 - "$f" "$tmp" <<'PY'
from pathlib import Path
import sys
src, dest = sys.argv[1:3]
text = Path(src).read_text()
old = '''cleanup() {
  [[ -n "$TMP_INFRA" && -d "$TMP_INFRA" ]] && rm -rf "$TMP_INFRA"
}'''
new = '''cleanup() {
  [[ -n "$TMP_INFRA" && -d "$TMP_INFRA" ]] && rm -rf "$TMP_INFRA"
  return 0  # koku-ui setup-operator: empty TMP_INFRA must not fail the trap
}'''
if old not in text:
    raise SystemExit("deploy-byoi.sh cleanup() block not found")
Path(dest).write_text(text.replace(old, new, 1))
PY
  mv "$tmp" "$f"
  chmod +x "$f"
  ok "patched deploy-byoi.sh EXIT trap so SKIP_INFRA does not fail the installer"
}

# Sample CR hard-codes Keycloak in namespace "keycloak". Workshop clusters
# often already use that NS for SSO, so we deploy RHBK to cost-keycloak.
# demo-preprod.sh's render_preprod_cr looks up the exact url line, so keep
# the sample and the renderer in sync.
patch_byoi_keycloak_url() {
  local f="${OPERATOR_DIR}/config/samples/byoi/app/costmanagementserviceconfig.yaml"
  [[ -f "$f" ]] || fail "CMSC sample not found: $f"
  local tmp
  tmp="$(mktemp)"
  sed "s|keycloak-service.keycloak.svc.cluster.local|keycloak-service.${KEYCLOAK_NAMESPACE}.svc.cluster.local|g" "$f" >"$tmp"
  mv "$tmp" "$f"
  ok "set spec.auth.keycloak.url host to keycloak-service.${KEYCLOAK_NAMESPACE}.svc"

  local render="${OPERATOR_DIR}/hack/lib/demo-preprod.bash"
  [[ -f "$render" ]] || fail "demo-preprod.bash not found: $render"
  python3 - "$render" "$KEYCLOAK_NAMESPACE" <<'PY'
from pathlib import Path
import sys
path, ns = Path(sys.argv[1]), sys.argv[2]
text = path.read_text()
old = 'old_url = \'      url: "http://keycloak-service.keycloak.svc.cluster.local:8080"\''
new = f'old_url = \'      url: "http://keycloak-service.{ns}.svc.cluster.local:8080"\''
if new in text:
    raise SystemExit(0)
if old not in text and f'keycloak-service.{ns}.svc' not in text:
    raise SystemExit(f"render_preprod_cr old_url not found in {path}")
if old in text:
    path.write_text(text.replace(old, new, 1))
PY
  ok "aligned render_preprod_cr with Keycloak namespace ${KEYCLOAK_NAMESPACE}"
}

patch_byoi_minio_images
patch_byoi_cleanup_trap
patch_byoi_keycloak_url

if [[ ! -x "${CHART_ROOT}/scripts/deploy-rhbk.sh" ]]; then
  fail "CHART_ROOT has no scripts/deploy-rhbk.sh: ${CHART_ROOT}
Clone https://github.com/project-koku/cost-onprem-chart next to koku-ui, or set CHART_ROOT."
fi
ok "CHART_ROOT=${CHART_ROOT}"

CHART_VALUES="${CHART_ROOT}/cost-onprem/values.yaml"
[[ -f "$CHART_VALUES" ]] || fail "chart values not found: ${CHART_VALUES}"

# Operator samples pin older koku (e.g. 768be82) that omits user-access type
# "sources", so Settings → Integrations always denies access. Copy the chart's
# koku tag (or KOKU_IMAGE_TAG) onto the CMSC sample and the live CR.
chart_koku_tag() {
  python3 - "$CHART_VALUES" <<'PY'
from pathlib import Path
import re, sys
text = Path(sys.argv[1]).read_text()
m = re.search(
    r'repository:\s*quay.io/redhat-services-prod/cost-mgmt-dev-tenant/koku\s*\n\s*tag:\s*"([^"]+)"',
    text,
)
if not m:
    raise SystemExit("could not read koku image tag from chart values.yaml")
print(m.group(1))
PY
}

replace_repo_tag() {
  local file="$1" repo="$2" tag="$3"
  python3 - "$file" "$repo" "$tag" <<'PY'
from pathlib import Path
import re, sys
path, repo, tag = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
text = path.read_text()
pat = re.compile(
    rf'(repository:\s*{re.escape(repo)}\s*\n\s*tag:\s*")[^"]+(")'
)
new, n = pat.subn(rf'\g<1>{tag}\2', text)
if n == 0:
    raise SystemExit(f"no tag found after repository {repo} in {path}")
path.write_text(new)
print(n)
PY
}

if [[ -z "${KOKU_IMAGE_TAG:-}" ]]; then
  KOKU_IMAGE_TAG="$(chart_koku_tag)"
  ok "koku image tag ${KOKU_IMAGE_TAG} (from chart values.yaml)"
else
  ok "koku image tag ${KOKU_IMAGE_TAG} (KOKU_IMAGE_TAG)"
fi

patch_byoi_koku_image_from_chart() {
  local f="${OPERATOR_DIR}/config/samples/byoi/app/costmanagementserviceconfig.yaml"
  [[ -f "$f" ]] || fail "CMSC sample not found: $f"
  local n
  n="$(replace_repo_tag "$f" "quay.io/redhat-services-prod/cost-mgmt-dev-tenant/koku" "$KOKU_IMAGE_TAG")"
  ok "set CMSC sample koku api/masu tag to ${KOKU_IMAGE_TAG} (${n} replacements)"
}

sync_live_cmsc_koku_image() {
  oc get cmsc "$CR_NAME" -n "$NAMESPACE" >/dev/null 2>&1 || return 0
  local current
  current="$(oc get cmsc "$CR_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.costManagement.api.image.tag}' 2>/dev/null || true)"
  if [[ "$current" == "$KOKU_IMAGE_TAG" ]]; then
    ok "live CMSC already on koku ${KOKU_IMAGE_TAG}"
    return 0
  fi
  log "Updating live CMSC koku api/masu ${current:-unset} → ${KOKU_IMAGE_TAG}"
  oc patch cmsc "$CR_NAME" -n "$NAMESPACE" --type=json -p="[
    {\"op\":\"replace\",\"path\":\"/spec/costManagement/api/image/tag\",\"value\":\"${KOKU_IMAGE_TAG}\"},
    {\"op\":\"replace\",\"path\":\"/spec/costManagement/masu/image/tag\",\"value\":\"${KOKU_IMAGE_TAG}\"}
  ]" >/dev/null
  ok "patched ${NAMESPACE}/${CR_NAME} koku tags"
}

wait_koku_image_ready() {
  oc get cmsc "$CR_NAME" -n "$NAMESPACE" >/dev/null 2>&1 || return 0
  log "Waiting for koku-api to run ${KOKU_IMAGE_TAG} and SchemaUpToDate=True"
  local i img cond
  for i in $(seq 1 150); do
    img="$(oc -n "$NAMESPACE" get deploy "${CR_NAME}-koku-api" -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || true)"
    [[ "$img" == *":${KOKU_IMAGE_TAG}" ]] && break
    sleep 5
  done
  [[ "$img" == *":${KOKU_IMAGE_TAG}" ]] \
    || fail "koku-api image is ${img:-missing}, expected tag ${KOKU_IMAGE_TAG}"
  oc -n "$NAMESPACE" rollout status "deploy/${CR_NAME}-koku-api" --timeout=600s
  oc -n "$NAMESPACE" rollout status "deploy/${CR_NAME}-koku-masu" --timeout=600s || true
  for i in $(seq 1 90); do
    cond="$(oc get cmsc "$CR_NAME" -n "$NAMESPACE" -o jsonpath='{range .status.conditions[?(@.type=="SchemaUpToDate")]}{.status}{end}' 2>/dev/null || true)"
    [[ "$cond" == "True" ]] && { ok "SchemaUpToDate=True"; return 0; }
    sleep 5
  done
  fail "SchemaUpToDate did not become True after koku ${KOKU_IMAGE_TAG}"
}

patch_byoi_koku_image_from_chart

export KUBE_CONTEXT
export NAMESPACE CR_NAME INFRA_NAMESPACE KAFKA_NAMESPACE KEYCLOAK_NAMESPACE
export CHART_ROOT
export RHBK_SCRIPT="${CHART_ROOT}/scripts/deploy-rhbk.sh"
export KUBECTL="${KUBECTL:-oc}"
export DEMO_NO_TMUX=1
export DEMO_NO_OPEN=1
export OPEN_BROWSER=0
export LOG_LEVEL="${LOG_LEVEL:-INFO}"
export BUILD_MODE="${BUILD_MODE:-auto}"

# ---------------------------------------------------------------------------
# Keycloak CA secret (oauth2-proxy + local start:onprem:operator)
# ---------------------------------------------------------------------------

create_keycloak_ca_secret() {
  local ns="$1"
  local secret_name="keycloak-ca-cert"
  if oc get secret "$secret_name" -n "$ns" >/dev/null 2>&1; then
    ok "secret ${ns}/${secret_name} already exists"
    return 0
  fi
  local ca_cert=""
  if oc get configmap default-ingress-cert -n openshift-config-managed >/dev/null 2>&1; then
    ca_cert="$(oc get configmap default-ingress-cert -n openshift-config-managed \
      -o jsonpath='{.data.ca-bundle\.crt}' 2>/dev/null || true)"
  fi
  if [[ -z "$ca_cert" ]] && oc get secret router-ca -n openshift-ingress-operator >/dev/null 2>&1; then
    ca_cert="$(oc get secret router-ca -n openshift-ingress-operator \
      -o jsonpath='{.data.tls\.crt}' | base64 -d 2>/dev/null || true)"
  fi
  [[ -n "$ca_cert" ]] || fail "could not extract cluster ingress CA for ${secret_name}"
  oc create secret generic "$secret_name" -n "$ns" --from-literal=ca.crt="$ca_cert" >/dev/null
  ok "created secret ${ns}/${secret_name}"
}

# python/mv patches (and some git clones) drop the executable bit. demo-preprod.sh
# invokes ./hack/deploy-byoi.sh directly, which then fails with Permission denied.
ensure_hack_scripts_executable() {
  local f
  for f in "${OPERATOR_DIR}/hack/"*.sh "${OPERATOR_DIR}/scripts/"*.sh; do
    [[ -f "$f" ]] || continue
    chmod +x "$f"
  done
  ok "operator hack/ and scripts/ are executable"
}

# ---------------------------------------------------------------------------
# Install
# ---------------------------------------------------------------------------

if [[ "$SYNC_IMAGES_ONLY" == "1" ]]; then
  oc get cmsc "$CR_NAME" -n "$NAMESPACE" >/dev/null 2>&1 \
    || fail "CostManagementServiceConfig ${NAMESPACE}/${CR_NAME} not found — run npm run setup:operator:install first"
  ok "skipping installer (--sync-images)"
else
  ensure_hack_scripts_executable
  log "Running operator pre-prod demo installer (this can take 20–40 minutes)"
  echo "  NAMESPACE=${NAMESPACE}  CR_NAME=${CR_NAME}  INFRA=${INFRA_NAMESPACE}"
  echo "  KAFKA=${KAFKA_NAMESPACE}  KEYCLOAK=${KEYCLOAK_NAMESPACE}"
  demo_args=(--no-tmux --no-open)
  if [[ "$DEMO_RESET" == "1" ]]; then
    demo_args+=(--reset)
  fi
  if [[ "$DEMO_DRY_RUN" == "1" ]]; then
    demo_args+=(--dry-run)
  fi
  (
    cd "$OPERATOR_DIR"
    ./hack/demo-preprod.sh "${demo_args[@]}"
  )
  [[ "$DEMO_DRY_RUN" == "1" ]] && { ok "dry-run complete — no cluster changes"; exit 0; }
  oc get ns "$NAMESPACE" >/dev/null 2>&1 || fail "namespace ${NAMESPACE} missing after installer"
  create_keycloak_ca_secret "$NAMESPACE"
  ok "operator install finished"
fi

if [[ "$DEMO_DRY_RUN" != "1" ]]; then
  sync_live_cmsc_koku_image
  wait_koku_image_ready
fi

DOMAIN="$(oc get ingress.config.openshift.io cluster -o jsonpath='{.spec.domain}')"
UI_URL="https://${CR_NAME}-ui-${NAMESPACE}.${DOMAIN}"

echo ""
echo "${C_BOLD}${C_GREEN}Operator install complete.${C_RESET}"
echo "  Cluster UI:  ${UI_URL}"
KEYCLOAK_HOST="$(oc get route keycloak -n "${KEYCLOAK_NAMESPACE:-keycloak}" -o jsonpath='{.spec.host}' 2>/dev/null || true)"
if [[ -n "$KEYCLOAK_HOST" ]]; then
  echo "  Keycloak admin console: https://${KEYCLOAK_HOST}/admin/"
  echo "    credentials: oc get secret keycloak-initial-admin -n ${KEYCLOAK_NAMESPACE:-keycloak} -o jsonpath='{.data.password}' | base64 -d"
fi
echo "  Realm UI users: admin / admin (org-admin), viewer / viewer"
echo "  Sync users:    npm run setup:operator:sync-users"
echo ""
echo "IQE ingest (sources + cost models) is not part of this script."
echo "  npm run setup:operator          # install + IQE (from scratch)"
echo "  npm run setup:operator:iqe      # IQE only, if the operator is already installed"
echo "  npm run start:onprem:operator   # local UI → http://localhost:9002"
