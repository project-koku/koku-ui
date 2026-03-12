#!/usr/bin/env bash
#
# scripts/setup-dev-env.sh
#
# Sets up the full dev environment: koku backend (Podman) + koku-ui frontend (npm).
# Run from the koku-ui repo root.  macOS only (Intel and Apple silicon).
#
#   bash scripts/setup-dev-env.sh
#
# Prerequisites:
#   - Podman Desktop 4+ (https://podman-desktop.io/)   <-- see note below re: Docker
#   - Node.js 22.20+ with npm
#   - curl, git, make
#   - Python 3.11 exactly  (brew install python@3.11)
#   - pipenv               (pip3 install pipenv)
#   - koku repo cloned next to koku-ui: git clone git@github.com:project-koku/koku.git ../koku
#
# Note on container runtime:
#   This project uses Podman rather than Docker (no Docker license).
#   Podman Desktop (https://podman-desktop.io/) provides a full drop-in CLI, and
#   the koku Makefile auto-detects it. This script requires Podman and will not
#   fall back to Docker. Tracked files (e.g. docker-compose.yml) are left as-is
#   and are run with Podman Compose.
#
# Development paths — choose one after setup completes:
#
#   Path A — koku-ui-onprem (EXPERIMENTAL)
#     npm run start:onprem   -> http://localhost:9000  (local backend, no SSO login)
#
#     koku-ui-onprem creates a special build of koku-ui-hccm and koku-ui-ros and
#     runs them in a standalone webpack Module Federation environment. It proxies
#     API calls to your local koku backend, so no Red Hat SSO account is needed.
#     Recommended for: testing new backend features with the frontend.
#
#     Note: federated-module debugging appears to work normally in practice —
#     source is visible in DevTools and live updates propagate when editing
#     koku-ui-hccm directly. (Experimental; not yet guaranteed.)
#
#   Path B — direct koku-ui-hccm (standard)
#     npm run start:hccm     -> https://stage.foo.redhat.com:1337  (Red Hat SSO)
#
#     The traditional workflow against the Red Hat stage environment. Requires a
#     Red Hat account with Cost Management permissions.
#     Recommended for: UI feature development and end-to-end SaaS testing.
#
# Options:
#   --skip-backend   backend is already running, only set up the frontend
#   --skip-frontend  only set up the backend
#   --load-data      load sample AWS/Azure/GCP/OCP cost data without prompting
#   --skip-data      skip sample data loading without prompting
#
# If Podman Desktop quits, containers stop but are not deleted. Bring them back:
#   cd ../koku && podman compose start
# Then reload the browser — no need to re-run this script.

set -euo pipefail

# Detect host OS. This script is macOS-only.
_OS="$(uname -s 2>/dev/null || echo unknown)"
case "$_OS" in
  Darwin) _OS_LABEL="macOS" ;;
  *)      _OS_LABEL="$_OS"  ;;
esac

if [ "$_OS_LABEL" != "macOS" ]; then
  printf "\n\033[1;31m✗ This script supports macOS only.\033[0m\n" >&2
  printf "  Detected OS: %s\n" "$_OS_LABEL" >&2
  printf "  See GET_STARTED.md for manual setup instructions.\n" >&2
  exit 1
fi

KOKU_DIR="${KOKU_DIR:-../koku}"
SKIP_BACKEND=false
SKIP_FRONTEND=false
LOAD_SAMPLE_DATA=""   # empty = ask interactively; set via --load-data or --skip-data

for arg in "$@"; do
  case "$arg" in
    --skip-backend)  SKIP_BACKEND=true ;;
    --skip-frontend) SKIP_FRONTEND=true ;;
    --load-data)     LOAD_SAMPLE_DATA=true ;;
    --skip-data)     LOAD_SAMPLE_DATA=false ;;
    --help|-h)
      sed -n '3,54p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
  esac
done

# Disable ANSI colour codes when stdout is not a terminal (e.g. piped to tee or a CI log).
if [ -t 1 ]; then
  _C_BLUE='\033[1;34m'; _C_GREEN='\033[0;32m'; _C_YELLOW='\033[1;33m'
  _C_RED='\033[1;31m';  _C_RESET='\033[0m'
else
  _C_BLUE=''; _C_GREEN=''; _C_YELLOW=''; _C_RED=''; _C_RESET=''
fi

info()  { printf "\n${_C_BLUE}==> %s${_C_RESET}\n" "$*"; }
ok()    { printf "  ${_C_GREEN}✓${_C_RESET} %s\n" "$*"; }
warn()  { printf "  ${_C_YELLOW}⚠ %s${_C_RESET}\n" "$*"; }
fail()  { printf "\n${_C_RED}✗ %b${_C_RESET}\n" "$*" >&2; exit 1; }

# check prerequisites

info "Checking prerequisites"

# Guard: must be run from the koku-ui repo root.
if [ ! -d "apps/koku-ui-onprem" ]; then
  fail "Run this script from the koku-ui repo root.\n  cd /path/to/koku-ui\n  bash scripts/setup-dev-env.sh"
fi

if command -v podman >/dev/null 2>&1; then
  podman info >/dev/null 2>&1 || fail "Podman is installed but the machine is not running.\nOpen Podman Desktop and start the Podman machine, then try again."
  ok "Podman $(podman --version | awk '{print $3}')"
else
  fail "Podman is not installed. Install Podman Desktop from https://podman-desktop.io/"
fi

command -v node >/dev/null 2>&1 || fail "Node.js not found. Install from https://nodejs.org/ (22.20+)"
command -v npm  >/dev/null 2>&1 || fail "npm not found (should ship with Node.js)"
ok "Node $(node --version)  npm v$(npm --version)"

command -v git  >/dev/null 2>&1 || fail "git not found. Install from https://git-scm.com/"
command -v curl >/dev/null 2>&1 || fail "curl not found (pre-installed on macOS — check your PATH)"
command -v make >/dev/null 2>&1 || fail "make not found. Install it:\n  xcode-select --install"

# Warn if Node is below the recommended minimum.
_node_major=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -n "$_node_major" ] && [ "$_node_major" -lt 22 ] 2>/dev/null; then
  warn "Node.js $(node --version) detected — version 22.x or later is recommended."
fi

# Podman Compose is required. No Docker fallback — this project uses Podman
# (no Docker license). Install Podman Desktop to get podman compose:
#   https://podman-desktop.io/
if podman compose version >/dev/null 2>&1; then
  DC=(podman compose)
elif command -v podman-compose >/dev/null 2>&1; then
  DC=(podman-compose)
else
  fail "Podman Compose not found. Install Podman Desktop: https://podman-desktop.io/"
fi

if [ "$SKIP_BACKEND" = false ]; then
  # 'pip install pipenv' on macOS puts the binary in ~/Library/Python/x.y/bin/
  # which is not in PATH by default. Search common locations so the script works
  # even before the contributor has updated their shell profile.
  PIPENV_BIN=""
  if command -v pipenv >/dev/null 2>&1; then
    PIPENV_BIN="pipenv"
  else
    for dir in \
      "$HOME/Library/Python/3.11/bin" \
      "$HOME/Library/Python/3.12/bin" \
      "$HOME/Library/Python/3.13/bin" \
      "$HOME/.local/bin" \
      "$HOME/.local/share/pipenv/bin" \
      "/opt/homebrew/bin" \
      "/usr/local/bin" \
      "/usr/bin"; do
      if [ -x "$dir/pipenv" ]; then
        PIPENV_BIN="$dir/pipenv"
        break
      fi
    done
  fi
  if [ -z "$PIPENV_BIN" ]; then
    fail "pipenv not found. Run:\n  pip3 install pipenv\nThen add it to PATH:\n  echo 'export PATH=\"\$HOME/Library/Python/3.11/bin:\$PATH\"' >> ~/.zprofile && source ~/.zprofile"
  fi
  ok "pipenv $($PIPENV_BIN --version | awk '{print $3}')"

  # koku's Pipfile requires Python 3.11. Find it explicitly so pipenv doesn't
  # pick up a newer homebrew default by accident.
  PYTHON_BIN=""
  for candidate in python3.11 python3 python; do
    if command -v "$candidate" >/dev/null 2>&1; then
      ver=$("$candidate" --version 2>&1 | awk '{print $2}')
      if [ "$(echo "$ver" | cut -d. -f1,2)" = "3.11" ]; then
        PYTHON_BIN="$candidate"
        ok "Python $ver"
        break
      fi
    fi
  done
  if [ -z "$PYTHON_BIN" ]; then
    warn "Python 3.11 not found. Install it: brew install python@3.11"
  fi

  [ -d "$KOKU_DIR" ] \
    || fail "koku repo not found at '$KOKU_DIR'.\nClone it: git clone git@github.com:project-koku/koku.git $KOKU_DIR"
  ok "koku repo at $KOKU_DIR"
fi

# Ask whether to load sample data before starting any long-running operations,
# so the contributor can answer once and then step away while everything installs.
if [ "$SKIP_BACKEND" = false ] && [ -z "$LOAD_SAMPLE_DATA" ]; then
  if [ -t 0 ]; then
    printf "\n${_C_BLUE}==> Sample cost data${_C_RESET}\n" >&2
    printf "  Load sample AWS/Azure/GCP/OCP cost data into the backend?\n" >&2
    printf "   [y] Yes — report pages show populated rows (recommended for first run)\n" >&2
    printf "   [N] No  — faster setup; you can load it later with:\n" >&2
    printf "             cd %s && pipenv run make load-test-customer-data\n" "$KOKU_DIR" >&2
    printf "\n  Your choice [y/N]: " >&2
    read -r _sample_ans
    case "$_sample_ans" in
      [Yy]*) LOAD_SAMPLE_DATA=true ;;
      *)     LOAD_SAMPLE_DATA=false ;;
    esac
  else
    LOAD_SAMPLE_DATA=false
    warn "Non-interactive mode — skipping sample data. Re-run with --load-data to include it."
  fi
fi

# backend

if [ "$SKIP_BACKEND" = false ]; then
  info "Setting up backend"
  pushd "$KOKU_DIR" > /dev/null || fail "Cannot change to directory: $KOKU_DIR"

  info "Installing Python dependencies"
  # PIPENV_PYTHON pins to 3.11 even if homebrew's default is newer.
  # PIPENV_VENV_IN_PROJECT puts the venv inside the repo at .venv.
  PIPENV_VENV_IN_PROJECT=1 PIPENV_PYTHON="${PYTHON_BIN:-python3.11}" "$PIPENV_BIN" install --dev
  ok "Python dependencies installed"

  info "Installing pre-commit hooks"
  "$PIPENV_BIN" run pre-commit install
  ok "pre-commit hooks installed"

  info "Starting Compose services"
  # docker-up-min-trino starts PostgreSQL, Valkey, Unleash, koku-server,
  # masu-server, koku-worker, Trino, MinIO, and Hive metastore.
  # First run pulls ~1-2 GB of images. Subsequent starts are fast.
  #
  # Pass DOCKER=podman explicitly so the koku Makefile routes all compose
  # operations through Podman, even on machines where Docker is also installed.
  # Without this override, the Makefile's auto-detection picks Docker first.
  #
  # Podman's Docker-compat API has two quirks that require compose overrides:
  #   1. koku-worker maps host ports 6001-6020 to container port 9000. Podman
  #      rejects port ranges ("strconv.Atoi: parsing "6001-6020": invalid
  #      syntax"). Replace the range with a single mapping — sufficient for
  #      one local worker instance.
  #   2. Trino uses a legacy `links:` directive. Podman rejects links entirely
  #      ("bad parameter: link is not supported"). Services on a shared compose
  #      network can reach each other by name already, so links are redundant.
  _PODMAN_OVR=$(mktemp "${TMPDIR:-/tmp}/koku-podman-ovr-XXXXXX")
  trap 'rm -f "$_PODMAN_OVR"' EXIT
  printf 'services:\n  koku-worker:\n    ports: !reset\n      - "6001:9000"\n      - "5678:5678"\n  trino:\n    links: !reset\n' \
    > "$_PODMAN_OVR"
  COMPOSE_FILE="docker-compose.yml:$_PODMAN_OVR" \
    "$PIPENV_BIN" run make DOCKER="$(command -v podman)" docker-up-min-trino
  ok "Containers started"

  # koku's .env sets AWS_ACCESS_KEY_ID= (empty string). Compose's
  # ${VAR-default} syntax only substitutes when the variable is UNSET, not empty,
  # so the blank value flows into Trino's Glue connector, which NPEs with
  # "Access key ID cannot be blank". koku uses hive/thrift, not AWS Glue, so a
  # dummy value is safe. Always force-recreate Trino with non-empty credentials.
  #
  # The _PODMAN_OVR override (links: !reset) is reused here so the Trino
  # recreate doesn't hit the same Podman link-not-supported rejection.
  #
  # Export USER_ID and GROUP_ID so docker-compose.yml's ${USER_ID:?} / ${GROUP_ID:?}
  # resolve correctly for direct $DC calls. The koku Makefile sets these automatically
  # (via `id -u` / `id -g`), but $DC invocations that bypass make leave them unset.
  # Without this, the MinIO rebind silently fails — compose exits with an error
  # whose message contains the word "variable", which the grep filter suppresses.
  export USER_ID="${USER_ID:-$(id -u)}"
  export GROUP_ID="${GROUP_ID:-$(id -g)}"
  info "Restarting Trino with local-dev credentials (Glue connector fix)"
  AWS_ACCESS_KEY_ID=local-dev AWS_SECRET_ACCESS_KEY=local-dev \
    "${DC[@]}" -f docker-compose.yml -f "$_PODMAN_OVR" up -d --no-deps --force-recreate trino 2>&1 \
    | grep -Ev 'WARN|variable|^$' || true
  rm -f "$_PODMAN_OVR"
  ok "Trino started"

  info "Waiting for koku-server (up to 3 minutes)"
  # koku-server runs Django migrations on first start before accepting traffic.
  SERVER_UP=false
  _tries=0
  _MAX_WAIT=180    # seconds total before giving up
  _POLL_INTERVAL=2 # seconds between health-check attempts
  _MAX_TRIES=$((_MAX_WAIT / _POLL_INTERVAL))
  while [ "$_tries" -lt "$_MAX_TRIES" ]; do
    if curl -sf http://localhost:8000/api/cost-management/v1/status/ >/dev/null 2>&1; then
      SERVER_UP=true; break
    fi
    printf "."; sleep "$_POLL_INTERVAL"
    _tries=$((_tries + 1))
  done
  echo ""
  if [ "$SERVER_UP" = true ]; then
    ok "koku-server is up at http://localhost:8000"
  else
    warn "koku-server did not respond after ${_MAX_WAIT}s — check logs: cd $KOKU_DIR && ${DC[*]} logs koku-server"
  fi

  info "Creating test customer and providers"
  # Must call the script directly with --api-prefix. The koku .env sets
  # API_PATH_PREFIX=/api/cost-management; without the flag the script sends
  # requests to /api/v1/... which returns 404 every time.
  "$PIPENV_BIN" run python dev/scripts/create_test_customer.py --api-prefix /api/cost-management
  ok "Test customer created (org_id: 1234567, username: test_customer)"

  if [ "$LOAD_SAMPLE_DATA" = true ]; then
    info "Loading sample cost data (AWS, Azure, GCP, OCP)"
    # koku-worker processes this asynchronously — wait a minute or two before
    # expecting report pages to show rows.
    # This step uploads to MinIO at localhost:9000; the port rebinding happens after.
    "$PIPENV_BIN" run make DOCKER="$(command -v podman)" load-test-customer-data || \
      warn "load-test-customer-data had errors (partial upload) — reports may show less data"
    ok "Data seeded — worker is processing in the background"
  else
    ok "Skipped sample data. To load later: cd $KOKU_DIR && pipenv run make load-test-customer-data"
  fi

  # MinIO binds host port 9000, which conflicts with the webpack devServer (also 9000).
  # All backend services reach MinIO via container-internal address koku-minio:9000,
  # so the host port binding is not needed for normal dev work. Remove it to free
  # port 9000 for the frontend. Done AFTER data loading, which uses localhost:9000.
  info "Freeing host port 9000 from MinIO (needed by webpack devServer)"
  # Use a temporary compose override file rather than modifying the tracked
  # docker-compose.yml. mktemp creates a securely named file, avoiding the
  # predictable-filename risk of using $$ (PID). Podman Compose accepts any
  # file extension for -f override files, so no .yml suffix is required.
  _OVR=$(mktemp "${TMPDIR:-/tmp}/koku-minio-ovr-XXXXXX")
  trap 'rm -f "$_PODMAN_OVR" "$_OVR"' EXIT
  cat > "$_OVR" << 'MINIO_OVERRIDE_EOF'
services:
  minio:
    ports: !reset
      - "9090:9090"
MINIO_OVERRIDE_EOF
  "${DC[@]}" -f docker-compose.yml -f "$_OVR" up -d --no-deps --force-recreate minio 2>&1 \
    | grep -Ev 'WARN|variable|^$' || true
  rm -f "$_OVR"
  # Verify the rebind took effect using lsof (runtime-agnostic — works whether
  # the container daemon is Podman or any other OCI runtime).
  sleep 1
  if lsof -iTCP:9000 -sTCP:LISTEN -t 2>/dev/null | grep -q .; then
    warn "MinIO still has host port 9000. Run manually to free it:"
    warn "  cd $KOKU_DIR"
    warn "  ${DC[*]} stop minio && ${DC[*]} up -d --no-deps minio"
    warn "  # OR follow the MinIO troubleshooting section in GET_STARTED.md"
  else
    ok "Host port 9000 freed — webpack devServer can now bind to port 9000"
  fi

  popd > /dev/null

  echo ""
  echo "  Koku API   -> http://localhost:8000/api/cost-management/v1/status/"
  echo "  MASU       -> http://localhost:5042"
  echo "  PostgreSQL -> localhost:15432 (user: koku, db: koku)"
  echo ""
  echo "  Logs:    cd $KOKU_DIR && ${DC[*]} logs -f koku-server koku-worker"
  echo "  Restart: cd $KOKU_DIR && ${DC[*]} start"
fi

# frontend

if [ "$SKIP_FRONTEND" = false ]; then
  info "Installing npm dependencies"
  npm install
  ok "npm dependencies installed"

  # Needed for start:hccm (stage.foo.redhat.com proxy)
  if grep -q 'stage.foo.redhat.com' /etc/hosts 2>/dev/null; then
    ok "/etc/hosts already has stage.foo.redhat.com"
  else
    warn "/etc/hosts is missing the stage proxy entries."
    echo "  To add them:"
    echo "    sudo bash -c 'echo \"127.0.0.1 stage.foo.redhat.com\" >> /etc/hosts'"
    echo "    sudo bash -c 'echo \"127.0.0.1 prod.foo.redhat.com\" >> /etc/hosts'"
    echo "  Or run: npm run -w @koku-ui/koku-ui-hccm patch:hosts"
  fi

  # apps/koku-ui-onprem/.env is gitignored. The webpack devServer reads
  # API_PROXY_URL to know where to forward /api/cost-management/v1/* requests.
  # Without this file, start:onprem proxies nowhere and every API call 504s.
  ENV_FILE="apps/koku-ui-onprem/.env"
  if [ -f "$ENV_FILE" ]; then
    ok "$ENV_FILE already exists"
  else
    info "Creating $ENV_FILE"
    cat > "$ENV_FILE" <<'EOF'
API_PROXY_URL=http://localhost:8000/api/cost-management/v1
API_TOKEN=
EOF
    ok "$ENV_FILE created"
  fi

  echo ""
  echo "  Start options (choose a path):"
  echo ""
  echo "    Path A — koku-ui-onprem (EXPERIMENTAL; recommended for backend feature testing):"
  echo "      npm run start:onprem"
  echo "      -> http://localhost:9000   no SSO login required"
  echo "      -> proxies /api/cost-management/v1/* to your local koku backend"
  echo "      -> runs koku-ui-hccm + koku-ui-ros via webpack Module Federation"
  echo ""
  echo "    Path B — direct koku-ui-hccm (standard; recommended for UI feature development):"
  echo "      npm run start:hccm"
  echo "      -> https://stage.foo.redhat.com:1337   requires Red Hat SSO login"
  echo "      npm run -w @koku-ui/koku-ui-hccm start:local:api"
  echo "      -> http://localhost:1337   local Keycloak auth (Compose stack)"
fi

info "Done"

