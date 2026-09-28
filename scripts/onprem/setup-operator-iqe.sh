#!/usr/bin/env bash
# ============================================================
# setup-operator-iqe.sh
# ============================================================
#
# QE operator flow (Deployment + IQE test setup / ingest):
#   1. Martin's operator install (hack/demo-preprod.sh) — npm run setup:operator:install
#   2. source iqe-cost-management-plugin/onprem_setup/setup_onprem_cluster.sh
#      (IQE dynaconf env, masu IQE_TEST_RUN, extra rbac_user)
#   3. Run IQE tests that ingest sources / cost models
#
# Usage (from koku-ui repo root):
#   npm run setup:operator:iqe              # QE cluster setup + leftover OCP ingest
#   npm run setup:operator:iqe:setup        # step 2 only (venv + cluster setup)
#   npm run setup:operator:iqe:ingest       # step 3 only (IQE data_setup, kept for UI)
#
# Extra flags after -- are forwarded here:
#   --setup-only     venv + QE setup_onprem_cluster.sh (no tests)
#   --ingest-only    ingest only (assumes venv + cluster setup already ran)
#   --keep-sources   do not delete existing sources/cost models before ingest
#   --smoke          QE PR smoke suite (~43 tests). Fixtures still delete sources
#                    after each test, so this is a pass/fail check, not leftover UI data.
#   --filter EXPR    override the IQE -k filter (default: test_data_setup_ocp_single)
#   --marker EXPR    override the IQE -m marker (default keeps sources for the UI)
#
# Environment:
#   IQE_CORE_PATH / IQE_PLUGIN_PATH / OPERATOR_DIR / KEYCLOAK_NAMESPACE
#   NAMESPACE / CR_NAME  (defaults: cost-byoi / cost-management)
#   NISE_OUTPUT_DIR      cwd for IQE/NISE (default: <koku-ui>/nise-output, gitignored)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# setup_onprem_cluster.sh is sourced and assigns SCRIPT_DIR to its own temp copy.
# Keep this path for the koku-ui scripts invoked after that source.
KOKU_ONPREM_DIR="$SCRIPT_DIR"
KOKU_UI_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPOS_DIR="$(cd "${KOKU_UI_DIR}/.." && pwd)"

OPERATOR_DIR="${OPERATOR_DIR:-${REPOS_DIR}/koku-service-operator}"
IQE_CORE_PATH="${IQE_CORE_PATH:-${REPOS_DIR}/iqe-core}"
IQE_PLUGIN_PATH="${IQE_PLUGIN_PATH:-${REPOS_DIR}/iqe-cost-management-plugin}"
IQE_CORE_REPO="${IQE_CORE_REPO:-https://gitlab.cee.redhat.com/insights-qe/iqe-core.git}"
IQE_PLUGIN_REPO="${IQE_PLUGIN_REPO:-https://gitlab.cee.redhat.com/insights-qe/iqe-cost-management-plugin.git}"
VENV_PATH="${VENV_PATH:-${OPERATOR_DIR}/.venv-iqe}"
PYTHON_BIN="${PYTHON_BIN:-python3.12}"

NAMESPACE="${NAMESPACE:-cost-byoi}"
CR_NAME="${CR_NAME:-cost-management}"
KEYCLOAK_NAMESPACE="${KEYCLOAK_NAMESPACE:-}"
NISE_OUTPUT_DIR="${NISE_OUTPUT_DIR:-${KOKU_UI_DIR}/nise-output}"

SETUP_ONLY=0
INGEST_ONLY=0
CLEAN_SOURCES=1
USE_SMOKE=0
FILTER_EXPLICIT=0
MARKER_EXPLICIT=0
# QE leftover-UI ingest: data_setup test + cost_skip_cleanup in markexpr so
# fixtures do not delete the source/cost model after the test.
IQE_FILTER="${IQE_FILTER:-test_data_setup_ocp_single}"
IQE_MARKER="${IQE_MARKER:-cost_ingest_source or cost_skip_cleanup}"

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

while [[ $# -gt 0 ]]; do
  case "$1" in
    --setup-only) SETUP_ONLY=1; shift ;;
    --ingest-only) INGEST_ONLY=1; shift ;;
    --keep-sources) CLEAN_SOURCES=0; shift ;;
    --smoke) USE_SMOKE=1; shift ;;
    --filter) IQE_FILTER="$2"; FILTER_EXPLICIT=1; shift 2 ;;
    --marker) IQE_MARKER="$2"; MARKER_EXPLICIT=1; shift 2 ;;
    -h|--help)
      sed -n '2,28p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) fail "unknown flag: $1" ;;
  esac
done

command -v oc >/dev/null 2>&1 || fail "oc not found"
oc whoami >/dev/null 2>&1 || fail "not logged in — run oc login"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || fail "${PYTHON_BIN} not found (IQE requires Python 3.12)"

if [[ -z "$KEYCLOAK_NAMESPACE" ]]; then
  if oc get secret keycloak-client-secret-cost-management-operator -n keycloak >/dev/null 2>&1; then
    KEYCLOAK_NAMESPACE=keycloak
  elif oc get secret keycloak-client-secret-cost-management-operator -n cost-keycloak >/dev/null 2>&1; then
    KEYCLOAK_NAMESPACE=cost-keycloak
  else
    fail "Keycloak Cost Management client secret not found in keycloak or cost-keycloak"
  fi
fi
ok "KEYCLOAK_NAMESPACE=${KEYCLOAK_NAMESPACE}"

oc get cmsc "$CR_NAME" -n "$NAMESPACE" >/dev/null 2>&1 \
  || fail "CostManagementServiceConfig ${NAMESPACE}/${CR_NAME} not found — run npm run setup:operator:install first"

ensure_clone() {
  local dir="$1" repo="$2" name="$3"
  if [[ -d "${dir}/.git" ]]; then
    ok "using ${name}: ${dir}"
    return 0
  fi
  log "cloning ${name} → ${dir}"
  git clone --depth 1 "$repo" "$dir"
  ok "cloned ${name}"
}

ensure_clone "$IQE_CORE_PATH" "$IQE_CORE_REPO" "iqe-core"
ensure_clone "$IQE_PLUGIN_PATH" "$IQE_PLUGIN_REPO" "iqe-cost-management-plugin"
[[ -f "${IQE_PLUGIN_PATH}/onprem_setup/setup_onprem_cluster.sh" ]] \
  || fail "QE setup_onprem_cluster.sh missing in ${IQE_PLUGIN_PATH}"
[[ -x "${OPERATOR_DIR}/scripts/run-iqe-tests-local.sh" ]] \
  || fail "operator IQE local runner missing: ${OPERATOR_DIR}/scripts/run-iqe-tests-local.sh"

# ---------------------------------------------------------------------------
# Step 2 — QE onprem_setup/setup_onprem_cluster.sh
# The upstream script hard-codes namespace "keycloak". Workshop clusters keep
# SSO there, so Cost Management RHBK lives in cost-keycloak. Copy the QE
# onprem_setup dir and rewrite only that namespace before sourcing.
# ---------------------------------------------------------------------------
qe_cluster_setup() {
  log "QE step 2: source onprem_setup/setup_onprem_cluster.sh"
  local tmp
  tmp="$(mktemp -d "${TMPDIR:-/tmp}/onprem-setup.XXXXXX")"
  cp -R "${IQE_PLUGIN_PATH}/onprem_setup/." "${tmp}/"
  if [[ "$KEYCLOAK_NAMESPACE" != "keycloak" ]]; then
    python3 - "$tmp/setup_onprem_cluster.sh" "$KEYCLOAK_NAMESPACE" <<'PY'
from pathlib import Path
import sys
path, ns = Path(sys.argv[1]), sys.argv[2]
text = path.read_text()
text = text.replace("-n keycloak", f"-n {ns}")
path.write_text(text)
PY
    ok "rewrote QE setup script to use Keycloak namespace ${KEYCLOAK_NAMESPACE}"
  fi
  # Operator JWT org_id is "org1234567"; upstream grant script only creates tenant "1234567".
  python3 - "$tmp/onprem_grant_rbac_roles.py" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
text = path.read_text()
old = '''tenant, created = Tenant.objects.get_or_create(
    org_id=org_id, defaults={"tenant_name": "acct" + acct_number, "ready": True}
)


grp, _ = Group.objects.get_or_create(
    name="CI Test Admin", tenant=tenant, defaults={"admin_default": False, "system": True}
)
policy, _ = Policy.objects.get_or_create(name="CI Test Admin Policy", tenant=tenant, group=grp)
for role in roles_to_grant:
    policy.roles.add(role)


principal, _ = Principal.objects.get_or_create(
    username=sa_username, tenant=tenant, defaults={"type": "user"}
)
grp.principals.add(principal)
cache.clear()
print("Done. Principal", sa_username, "granted:", [r.name for r in roles_to_grant])
'''
new = '''org_ids = [org_id]
if str(org_id).startswith("org"):
    org_ids.append(str(org_id)[3:])
else:
    org_ids.append("org" + str(org_id))

for org_id in org_ids:
    tenant, created = Tenant.objects.get_or_create(
        org_id=org_id, defaults={"tenant_name": "acct" + acct_number, "ready": True}
    )
    grp, _ = Group.objects.get_or_create(
        name="CI Test Admin", tenant=tenant, defaults={"admin_default": False, "system": True}
    )
    policy, _ = Policy.objects.get_or_create(name="CI Test Admin Policy", tenant=tenant, group=grp)
    for role in roles_to_grant:
        policy.roles.add(role)
    principal, _ = Principal.objects.get_or_create(
        username=sa_username, tenant=tenant, defaults={"type": "user"}
    )
    grp.principals.add(principal)
    TenantMapping.objects.get_or_create(tenant=tenant, defaults={"v2_write_activated_at": None})
    print("Done. Principal", sa_username, "tenant", org_id, "granted:", [r.name for r in roles_to_grant])

cache.clear()
'''
if old not in text:
    raise SystemExit(f"could not patch org_id tenants in {path}")
text = text.replace(old, new, 1)
imp = "from management.models import Group, Policy, Principal, Role\n"
if "tenant_mapping" not in text:
    text = text.replace(
        imp,
        imp + "from management.tenant_mapping.model import TenantMapping\n",
        1,
    )
path.write_text(text)
PY
  ok "RBAC grant covers tenants 1234567 and org1234567"
  export KEYCLOAK_NAMESPACE COST_NAMESPACE="$NAMESPACE"
  # The QE script is meant to be sourced interactively (no nounset / errexit).
  set +euo pipefail
  # shellcheck source=/dev/null
  source "${tmp}/setup_onprem_cluster.sh"
  local rc=$?
  set -euo pipefail
  [[ $rc -eq 0 ]] || fail "QE setup_onprem_cluster.sh failed (exit ${rc})"
  ok "QE cluster setup finished (rbac_user / masu IQE_TEST_RUN / dynaconf)"
  sync_keycloak_realm_users
  grant_viewer_rbac_permissions
}

sync_keycloak_realm_users() {
  log "Syncing Keycloak realm users (admin/viewer + org-admin role)"
  bash "${KOKU_ONPREM_DIR}/sync-keycloak-realm-users.sh"
}

grant_viewer_rbac_permissions() {
  log "Granting IAM read RBAC permissions to viewer user"
  bash "${KOKU_ONPREM_DIR}/grant-viewer-rbac-permissions.sh"
}

# ---------------------------------------------------------------------------
# IQE framework install (QE doc: Prerequisites + IQE framework + Cost Management)
# Delegates to the operator local runner so pip/nexus/editable installs stay
# in one place.
# ---------------------------------------------------------------------------
iqe_venv_setup() {
  export UV_NATIVE_TLS="${UV_NATIVE_TLS:-1}"
  export SSL_CERT_FILE="${SSL_CERT_FILE:-/etc/ssl/cert.pem}"
  if [[ -x "${VENV_PATH}/bin/iqe" ]]; then
    ok "IQE venv already present: ${VENV_PATH}"
    return 0
  fi
  log "Installing IQE framework + cost-management plugin (${PYTHON_BIN})"
  # uv's rustls stack rejects the Red Hat Nexus TLS cert on macOS; pip uses
  # the system trust store (same as curl). Hide uv for this install only.
  local path_no_uv
  path_no_uv="$(python3 -c 'import os; print(":".join(p for p in os.environ["PATH"].split(":") if not os.path.isfile(os.path.join(p, "uv"))))')"
  PATH="$path_no_uv" \
    PYTHON_BIN="$PYTHON_BIN" \
    IQE_CORE_PATH="$IQE_CORE_PATH" \
    IQE_PLUGIN_PATH="$IQE_PLUGIN_PATH" \
    VENV_PATH="$VENV_PATH" \
    NAMESPACE="$NAMESPACE" \
    HELM_RELEASE_NAME="$CR_NAME" \
    KEYCLOAK_NS="$KEYCLOAK_NAMESPACE" \
    "${OPERATOR_DIR}/scripts/run-iqe-tests-local.sh" --setup
}

# ---------------------------------------------------------------------------
# The operator IQE runner sets REQUESTS_CA_BUNDLE to router-ca only (plus
# Linux system bundles). On macOS / workshop clusters the apps wildcard is
# Google Trust Services, so NISE's Keycloak OAuth fails unless public CAs
# are in that bundle.
# ---------------------------------------------------------------------------
ensure_operator_public_cas() {
  local f="${OPERATOR_DIR}/scripts/run-iqe-tests-local.sh"
  [[ -f "$f" ]] || fail "operator IQE runner missing: $f"
  if grep -q 'Python certifi' "$f"; then
    ok "operator IQE runner includes public CAs in REQUESTS_CA_BUNDLE"
    return 0
  fi
  log "patching operator IQE runner to include macOS/certifi CAs"
  python3 - "$f" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
text = path.read_text()
old = """        elif [ -f /etc/ssl/certs/ca-certificates.crt ]; then
            echo "# System CA Bundle"
            cat /etc/ssl/certs/ca-certificates.crt
        fi
    } > "$ca_bundle_file"
"""
new = """        elif [ -f /etc/ssl/certs/ca-certificates.crt ]; then
            echo "# System CA Bundle"
            cat /etc/ssl/certs/ca-certificates.crt
        elif [ -f /etc/ssl/cert.pem ]; then
            echo "# System CA Bundle (macOS)"
            cat /etc/ssl/cert.pem
        fi
        local certifi_pem=""
        if [ -n "${VIRTUAL_ENV:-}" ] && [ -x "${VIRTUAL_ENV}/bin/python" ]; then
            certifi_pem="$("${VIRTUAL_ENV}/bin/python" -c "import certifi; print(certifi.where())" 2>/dev/null || true)"
        elif [ -x "${VENV_PATH}/bin/python" ]; then
            certifi_pem="$("${VENV_PATH}/bin/python" -c "import certifi; print(certifi.where())" 2>/dev/null || true)"
        fi
        if [ -n "$certifi_pem" ] && [ -f "$certifi_pem" ]; then
            echo "# Python certifi"
            cat "$certifi_pem"
        fi
    } > "$ca_bundle_file"
"""
if old not in text:
    raise SystemExit(f"could not patch setup_ssl_certs in {path}")
path.write_text(text.replace(old, new, 1))
PY
  ok "patched ${f}"
}

# IQE's cost_onprem NISE command prefixes:
#   REQUESTS_CA_BUNDLE=/tmp/router-ca.crt CURL_CA_BUNDLE=/tmp/router-ca.crt
# QE's setup_onprem_cluster.sh writes only the OpenShift router CA there. That
# is enough on CRC; workshop apps certs are Google Trust Services, so NISE's
# Keycloak token request fails unless public CAs are in the same file.
prepare_nise_router_ca() {
  local dest=/tmp/router-ca.crt
  local tmp certifi_pem
  tmp="$(mktemp "${TMPDIR:-/tmp}/router-ca.XXXXXX")"
  oc -n openshift-ingress-operator get secret router-ca \
    -o jsonpath='{.data.tls\.crt}' | base64 -d > "$tmp" \
    || fail "could not extract OpenShift router-ca"
  {
    echo "# OpenShift Ingress CA"
    cat "$tmp"
    if [[ -f /etc/pki/tls/certs/ca-bundle.crt ]]; then
      echo "# System CA Bundle"
      cat /etc/pki/tls/certs/ca-bundle.crt
    elif [[ -f /etc/ssl/certs/ca-certificates.crt ]]; then
      echo "# System CA Bundle"
      cat /etc/ssl/certs/ca-certificates.crt
    elif [[ -f /etc/ssl/cert.pem ]]; then
      echo "# System CA Bundle (macOS)"
      cat /etc/ssl/cert.pem
    fi
    if [[ -x "${VENV_PATH}/bin/python" ]]; then
      certifi_pem="$("${VENV_PATH}/bin/python" -c "import certifi; print(certifi.where())" 2>/dev/null || true)"
    fi
    if [[ -n "${certifi_pem:-}" && -f "$certifi_pem" ]]; then
      echo "# Python certifi"
      cat "$certifi_pem"
    fi
  } > "$dest"
  rm -f "$tmp"
  ok "wrote combined CA to ${dest} for NISE OAuth"
}

# A brand-new org has no koku Customer/tenant schema until a POST creates one,
# and IQE GETs /account-settings/data-retention/ first (503 if tenant_settings
# is missing). Create a throwaway source and ensure the tenant schema is cloned.
warmup_koku_tenant_schema() {
  log "Warming koku tenant schema so IQE data-retention can succeed"
  local kc_host gw_host client_id client_secret token api
  kc_host="$(oc -n "$KEYCLOAK_NAMESPACE" get route keycloak -o jsonpath='{.spec.host}')"
  gw_host="$(oc -n "$NAMESPACE" get route "${CR_NAME}-api" -o jsonpath='{.spec.host}')"
  client_id="$(oc -n "$KEYCLOAK_NAMESPACE" get secret keycloak-client-secret-cost-management-operator -o jsonpath='{.data.CLIENT_ID}' | base64 -d)"
  client_secret="$(oc -n "$KEYCLOAK_NAMESPACE" get secret keycloak-client-secret-cost-management-operator -o jsonpath='{.data.CLIENT_SECRET}' | base64 -d)"
  token="$(curl -sS -X POST "https://${kc_host}/realms/kubernetes/protocol/openid-connect/token" \
    -d grant_type=client_credentials -d client_id="$client_id" -d client_secret="$client_secret" \
    | python3 -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')"
  api="https://${gw_host}/api/cost-management/v1"
  curl -sk -o /dev/null -X POST "${api}/sources/" \
    -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" \
    -d '{"name":"iqe-tenant-warmup","source_type":"OCP","authentication":{"credentials":{"cluster_id":"iqe-tenant-warmup"}}}' \
    || true
  oc -n "$NAMESPACE" exec "deploy/${CR_NAME}-koku-api" -c koku-api -- \
    python /opt/koku/koku/manage.py shell -c \
    'from api.iam.models import Tenant
for t in Tenant.objects.exclude(schema_name="public"):
    t.create_schema()
    print("schema", t.schema_name)
' >/dev/null
  local i code
  for i in $(seq 1 30); do
    code="$(curl -sk -o /dev/null -w '%{http_code}' -H "Authorization: Bearer ${token}" \
      "${api}/account-settings/data-retention/")"
    if [[ "$code" == "200" ]]; then
      ok "data-retention is ready"
      return 0
    fi
    sleep 2
  done
  fail "data-retention still HTTP ${code} after tenant schema warmup"
}

# ---------------------------------------------------------------------------
# Step 3 — IQE ingest (OCP source + cost model left in place for the UI)
# ---------------------------------------------------------------------------
iqe_ingest() {
  ensure_operator_public_cas
  prepare_nise_router_ca
  warmup_koku_tenant_schema
  if [[ "$CLEAN_SOURCES" == "1" ]]; then
    warn "deleting existing sources and cost models so IQE data stands alone"
  fi
  local extra=(--namespace "$NAMESPACE")
  if [[ "$USE_SMOKE" == "1" ]]; then
    log "QE step 3: IQE smoke profile (PR suite; fixtures delete sources after tests)"
    extra+=(--profile smoke)
    if [[ "$FILTER_EXPLICIT" == "1" ]]; then
      extra+=(--filter "$IQE_FILTER")
    fi
    if [[ "$MARKER_EXPLICIT" == "1" ]]; then
      extra+=(--marker "$IQE_MARKER")
    fi
  else
    log "QE step 3: IQE ${IQE_FILTER} (sources kept for the UI)"
    extra+=(--marker "$IQE_MARKER" --filter "$IQE_FILTER")
  fi
  if [[ "$CLEAN_SOURCES" == "1" ]]; then
    extra+=(--clean-sources)
  fi
  # NISE writes monthly CSVs to cwd and only deletes them after a successful
  # upload. Run from nise-output/ so leftovers never land in the repo root.
  mkdir -p "$NISE_OUTPUT_DIR"
  ok "NISE working directory: ${NISE_OUTPUT_DIR}"
  (
    cd "$NISE_OUTPUT_DIR"
    PYTHON_BIN="$PYTHON_BIN" \
      IQE_CORE_PATH="$IQE_CORE_PATH" \
      IQE_PLUGIN_PATH="$IQE_PLUGIN_PATH" \
      VENV_PATH="$VENV_PATH" \
      NAMESPACE="$NAMESPACE" \
      HELM_RELEASE_NAME="$CR_NAME" \
      KEYCLOAK_NS="$KEYCLOAK_NAMESPACE" \
      "${OPERATOR_DIR}/scripts/run-iqe-tests-local.sh" "${extra[@]}"
  )
}

iqe_venv_setup

if [[ "$INGEST_ONLY" != "1" ]]; then
  qe_cluster_setup
else
  warn "skipping QE setup_onprem_cluster.sh (--ingest-only)"
fi

if [[ "$SETUP_ONLY" == "1" ]]; then
  echo ""
  echo "${C_BOLD}${C_GREEN}QE IQE cluster setup complete.${C_RESET}"
  echo "  Keycloak UI users:  admin / admin (org-admin), viewer / viewer (IAM read)"
  echo "  Extra RBAC user:    rbac_user / rbac_user"
  keycloak_host="$(oc get route keycloak -n "$KEYCLOAK_NAMESPACE" -o jsonpath='{.spec.host}' 2>/dev/null || true)"
  [[ -n "$keycloak_host" ]] && echo "  Keycloak console:   https://${keycloak_host}/admin/"
  echo ""
  echo "Ingest IQE sources and cost models:"
  echo "  npm run setup:operator:iqe:ingest"
  exit 0
fi

iqe_ingest

echo ""
echo "${C_BOLD}${C_GREEN}IQE ingest finished.${C_RESET}"
echo "  Sign in as admin / admin (or rbac_user / rbac_user) and open Settings → Integrations."
echo "  Local UI: npm run start:onprem:operator  → http://localhost:9002"
