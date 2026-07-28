#!/usr/bin/env bash

# ============================================================
# quick-start-koku.sh
# ============================================================
#
# Sets up the koku backend (API, worker, database, Trino) with
# sample cost data so you can develop and test koku-ui against
# the latest koku source without a Red Hat SSO account.
#
# Modes (npm targets):
#   npm run quick:start:koku         -> ONPREM=False, test_source=all
#   npm run quick:start:koku:onprem  -> ONPREM=True,  test_source=ONPREM (-o)
#
# Expected directory layout (overridable via env vars):
#   ../koku   -- project-koku/koku   (set KOKU_DIR to override)
#   ../nise   -- project-koku/nise   (set NISE_DIR to override)
#   .         -- project-koku/koku-ui (this repo)
#
# After this script completes, start the frontend with:
#   npm run start:quick:start:koku         -> http://localhost:9001  (SaaS-local)
#   npm run start:quick:start:koku:onprem  -> http://localhost:9001  (on-prem)
#
# See also: QUICK_START_KOKU.md
# Based on: https://github.com/project-koku/koku-ui/pull/4976
# ============================================================

# Initialise global defaults: PATH, temp dir, tool locations, and repo paths.
# Runs before any flag is parsed so all variables are available to every other function.
default()
{
  PATH=/usr/local/bin:/opt/podman/bin:/usr/bin:/usr/sbin:${PATH}
  export PATH

  SCRIPT=$(basename "$0")
  SCRIPT_DIR=$(dirname "$0")
  SCRIPT_DIR=$(cd "$SCRIPT_DIR" && pwd)
  TMP_DIR="/tmp/$SCRIPT.$$"

  mkdir $TMP_DIR

  # Podman
  PODMAN=$(command -v podman)
  PODMAN_COMPOSE="$PODMAN compose"
  PODMAN_OVERRIDE_FILE=$TMP_DIR/koku-podman-override
  export PODMAN_COMPOSE_WARNING_LOGS=false

  # Run commands by default
  RUN_COMMAND=1

  # Homebrew is required to locate build dependencies (librdkafka, openssl,
  # postgresql@16, python@3.11). Install it from https://brew.sh/
  if ! command -v brew >/dev/null 2>&1; then
    echo "Error: Homebrew not found. Install it from https://brew.sh/"
    exit 1
  fi

  # Homebrew prefix paths for tools used when building Python C extensions inside
  # the koku virtualenv. confluent-kafka links against librdkafka; cryptography
  # and psycopg2 require openssl headers; psycopg2 also needs the pg_config binary
  # from postgresql@16.
  LIBRDKAFKA_PREFIX=$(brew --prefix librdkafka)
  OPENSSL_PREFIX=$(brew --prefix openssl)
  POSTGRESQL_PREFIX=$(brew --prefix postgresql@16)
  PYTHON_PREFIX=$(brew --prefix python@3.11)

  export LDFLAGS="-L${OPENSSL_PREFIX}/lib -L${LIBRDKAFKA_PREFIX}/lib"
  export CPPFLAGS="-I${OPENSSL_PREFIX}/include -I${LIBRDKAFKA_PREFIX}/include"
  export PATH="$POSTGRESQL_PREFIX/bin:${PYTHON_PREFIX}/bin:$PATH"

  # Find Koku dirs
  if [ -z "$KOKU_UI_DIR" ]; then
    KOKU_UI_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
  fi
  if [ -z "$KOKU_DIR" ]; then
    KOKU_DIR=$(cd "$SCRIPT_DIR/../../koku" && pwd)
  fi
  if [ -z "$NISE_DIR" ]; then
    NISE_DIR=$(cd "$SCRIPT_DIR/../../nise" && pwd)
  fi

  # Find pipenv -- on macOS, use '/usr/local/bin/python3.11 -m pip install pipenv'
  PIPENV_BIN=""
  if command -v pipenv >/dev/null 2>&1; then
    PIPENV_BIN="pipenv"
  fi

  # Find python -- Koku's Pipfile requires Python 3.11
  PYTHON_BIN=""
  for CANDIDATE in python3.11 python3 python; do
    if command -v "$CANDIDATE" >/dev/null 2>&1; then
      VERSION=$($CANDIDATE --version 2>&1 | awk '{print $2}')
      if [[ "$(echo "$VERSION" | cut -d. -f1,2)" == "3.11" ]]; then
        PYTHON_BIN="$CANDIDATE"
        break
      fi
    fi
  done

  # koku's load_test_customer_data.sh prefers a host `aws` CLI to verify OCP
  # uploads. A broken leftover (common: old Homebrew/python3.7 aws) makes
  # verification fail even when nise uploaded successfully. Shadow only `aws`
  # with a containerized wrapper (do not strip its whole directory from PATH).
  if command -v aws >/dev/null 2>&1; then
    if ! aws --version >/dev/null 2>&1; then
      echo "*** Ignoring broken aws CLI at $(command -v aws); using containerized aws-cli"
      mkdir -p "$TMP_DIR/bin"
      # load_test_customer_data.sh checks `command -v aws` first; a failing stub
      # would skip the docker fallback and exit. Provide a working wrapper instead.
      cat > "$TMP_DIR/bin/aws" <<EOF
#!/bin/sh
RUNTIME="${PODMAN:-docker}"
exec "\$RUNTIME" run --rm --network host \\
  -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION \\
  amazon/aws-cli:latest "\$@"
EOF
      chmod +x "$TMP_DIR/bin/aws"
      PATH="$TMP_DIR/bin:$PATH"
      export PATH
      hash -r 2>/dev/null || true
    fi
  fi

  # Same script falls back to `docker` when aws is absent. On Podman-only
  # machines, provide a temporary docker -> podman shim for that check.
  if ! command -v docker >/dev/null 2>&1 && [ -n "$PODMAN" ]; then
    mkdir -p "$TMP_DIR/bin"
    ln -sf "$PODMAN" "$TMP_DIR/bin/docker"
    PATH="$TMP_DIR/bin:$PATH"
    export PATH
  fi
}

# Verify that all required tools are installed and the environment is ready.
# Exits with a descriptive error message and install hint if any check fails.
prereqs() {
  # koku's Makefile and dev scripts require bash 4+. macOS ships with bash 3.2
  # (held at GPL2) — 'brew install bash' provides 5.x. BASH_VERSINFO is a bash
  # built-in array; index 0 is the major version.
  if (( BASH_VERSINFO[0] < 4 )); then
    echo "Error: Bash 4+ required (running ${BASH_VERSION}). Install it: brew install bash"
    exit 1
  fi

  # Check for Node.js 22+
  NODE_MAJOR=$(node --version 2>/dev/null | tr -d 'v' | cut -d. -f1)
  if [[ -z "$NODE_MAJOR" ]] || (( NODE_MAJOR < 22 )); then
    echo "Error: Node.js 22+ required (found: $(node --version 2>/dev/null || echo 'not found'))"
    echo "Install it: nvm install 22 && nvm use 22"
    exit 1
  fi

  # Check for podman compose
  if ! $PODMAN_COMPOSE version >/dev/null 2>&1; then
    echo "Error: podman compose not found"
    exit 1
  fi

  # Check memory
  MEMORY=$(PODMAN machine inspect --format '{{.Resources.Memory}}')
  if (( MEMORY < 8192 )); then
    echo "Error: Set memory to 8GB (8192MB) and give it more CPUs, run:"
cat <<- EEOOFF
  $PODMAN machine stop
  $PODMAN machine set --memory 8192 --cpus 4
  $PODMAN machine start
EEOOFF
    exit 1
  fi

  # Port 15432 is koku's PostgreSQL test container. Leftover containers from a
  # failed previous run will prevent the new stack from binding to the port.
  if $PODMAN ps -a | grep -q 15432; then
    echo "Error: Stale test containers found on port 15432, run:"
cat <<- EEOOFF
  $PODMAN_COMPOSE down -v
EEOOFF
    exit 1
  fi

  # Test pipenv
  if [ -z "$PIPENV_BIN" ]; then
    echo "Error: pipenv not found"
    echo "Install it for Python 3.11 specifically: /usr/local/bin/python3.11 -m pip install pipenv"
    echo "Do NOT use plain 'pip3 install pipenv' — pip3 may point to a different Python version."
    exit 1
  fi

  # Find python -- Koku's Pipfile requires Python 3.11
  if [ -z "$PYTHON_BIN" ]; then
    echo "Error: Python 3.11 not found. Install it: brew install python@3.11"
    exit 1
  fi

  # Check for uv (used by niseVEnv to build the nise test data generator)
  if ! command -v uv >/dev/null 2>&1; then
    echo "Error: uv not found. Install it: brew install uv"
    exit 1
  fi

  # Check for make (used to start containers and load data)
  if ! command -v make >/dev/null 2>&1; then
    echo "Error: make not found. Install it: xcode-select --install"
    exit 1
  fi

  # Test Koku dir
  if [ ! -f "$KOKU_DIR/Pipfile" ]; then
    echo "Error: $KOKU_DIR not found"
    exit 1
  fi

  # Test nise dir
  if [ ! -f "$NISE_DIR/pyproject.toml" ]; then
    echo "Error: nise repo not found at $NISE_DIR"
    echo "Clone it: git clone git@github.com:project-koku/nise.git"
    exit 1
  fi

  # Check known macOS credential helper conflict.
  #
  # Docker Desktop, Rancher Desktop, and similar tools create ~/.docker and register
  # credential helpers that Podman's docker-compat layer cannot call, causing image
  # pulls to fail. Checking for the directory catches all of these tools regardless
  # of the specific config.json contents.
  if [[ -d ~/.docker ]]; then
    echo "Error: ~/.docker exists and may conflict with Podman."
    echo ""
    echo "  Docker Desktop, Rancher Desktop, and similar tools create ~/.docker"
    echo "  and register credential helpers that Podman cannot call. This causes"
    echo "  image pulls to fail with:"
    echo "    error listing credentials: exec: \"docker-credential-desktop\":"
    echo "    executable file not found in \$PATH"
    echo ""
    echo "  Rename the directory to remove the conflict:"
    echo "    mv ~/.docker ~/.docker.bak"
    echo ""
    echo "  Your credentials are preserved in ~/.docker.bak and can be"
    echo "  restored after Podman is set up."
    exit 1
  fi
}

# Print usage information.
usage()
{
cat <<- EEOOFF

    Sets up the koku backend with sample cost data for local UI development.

    bash [-x] $SCRIPT [-h|-c|-k|-n|-o|-v]

    OPTIONS:
    h       Display this message
    c       Clean previous build
    k       Create or update koku/.env
    n       Create or update nise/.env
    o       On-prem mode (ONPREM=True, test_source=ONPREM)
            Default without -o: SaaS/local mode (ONPREM=False, test_source=all)
    v       Verbose mode

EEOOFF
}

# Tear down the koku virtualenv and stop/remove containers from a previous run.
# Always destructive — removes volumes (Postgres, S4/Hive warehouse) and all data.
# Leaving the koku-s4-data volume causes Trino HIVE_PATH_ALREADY_EXISTS on the next
# OCP summary (metastore empty, S3 path still present) so has_data never becomes true.
clean()
{
  cd "$KOKU_DIR" || exit 1

  echo "*** Running make clean..."
  make clean >/dev/null 2>&1

  echo "*** Shutting down stack and wiping volumes (including S4/Hive data)..."
  echo "    make DOCKER=\"$PODMAN\" docker-down"
  runCommand
  if [ -n "$RUN_COMMAND" ]; then
    make DOCKER="$PODMAN" docker-down >/dev/null 2>&1 || true
    # Belt-and-suspenders: compose may leave the named volume if labels differ.
    $PODMAN volume rm -f koku-s4-data >/dev/null 2>&1 || true
  fi
}

# Signal handler registered via 'trap' in main.
# Removes the temp directory created by default() on SIGINT, SIGTERM, or EXIT.
cleanup()
{
  echo -e "\n*** Cleaning temp directory..."
  rm -rf $TMP_DIR
  exit 0
}

# Print the command to start the frontend once the backend is ready.
frontend() {
  echo -e "\n*** To start the frontend, run:"

  if [ -n "$MODE_ONPREM" ]; then
cat <<- EEOOFF
  npm run start:quick:start:koku:onprem
    -> http://localhost:9001  (on-prem UI, no SSO)
    -> proxies /api/cost-management/v1/* to local koku (ONPREM=True)
EEOOFF
  else
cat <<- EEOOFF
  npm run start:quick:start:koku
    -> http://localhost:9001  (no SSO; good for local API testing)
    -> proxies /api/cost-management/v1/* to local koku (ONPREM=False, full providers)
EEOOFF
  fi
}

# Create or update koku/.env with values required for local development:
# S4 object-store credentials, API path prefixes, Unleash tokens, and the
# current user/group IDs required by docker-compose.yml.
kokuEnv()
{
  cd "$KOKU_DIR" || exit 1

  if [[ ! -f .env && -n "$KOKU_ENV" ]]; then
    echo -e "\n*** Copying $KOKU_DIR/.env.example..."
    cp .env.example .env
  fi

  # Test koku .env -- without it, podman compose aborts with "required variable UNLEASH_TOKEN is missing"
  if [ ! -f .env ]; then
    echo "Error: $KOKU_DIR/.env not found"
    echo "Create it: cd $KOKU_DIR && cp .env.example .env"
    exit 1
  fi

  if [ -n "$KOKU_ENV" ]; then
    echo "*** Updating $KOKU_DIR/.env file..."

    # First pass: append any keys that are entirely absent from the file.
    # Second pass (sed below): overwrite all known keys to their local-dev values.
    # Together these handle both a freshly copied .env.example and a previously
    # customised .env without leaving stale or duplicate entries.
    # Match only active assignments (^KEY=). A commented "# KEY=..." must not
    # skip the append — otherwise sed can leave the real value unset.
    if ! grep -q "^AWS_ACCESS_KEY_ID=" .env 2>/dev/null; then
      echo "AWS_ACCESS_KEY_ID=local-dev" >> .env
    fi
    if ! grep -q "^AWS_SECRET_ACCESS_KEY=" .env 2>/dev/null; then
      echo "AWS_SECRET_ACCESS_KEY=local-dev" >> .env
    fi
    if ! grep -q "^CURRENCY_URL=" .env 2>/dev/null; then
      echo "CURRENCY_URL=https://open.er-api.com/v6/latest/USD" >> .env
    fi
    if ! grep -q "^KOKU_API_PATH_PREFIX=" .env 2>/dev/null; then
      echo "KOKU_API_PATH_PREFIX='/api/cost-management'" >> .env
    fi
    if ! grep -q "^MASU_API_PATH_PREFIX=" .env 2>/dev/null; then
      echo "MASU_API_PATH_PREFIX='/api/cost-management'" >> .env
    fi
    if ! grep -q "^GROUP_ID=" .env 2>/dev/null; then
      echo "GROUP_ID=$(id -g)" >> .env
    fi
    if ! grep -q "^USER_ID=" .env 2>/dev/null; then
      echo "USER_ID=$(id -u)" >> .env
    fi
    if ! grep -q "^ONPREM=" .env 2>/dev/null; then
      echo "ONPREM=${ONPREM_VALUE}" >> .env
    fi
    if ! grep -q "^S3_ACCESS_KEY=" .env 2>/dev/null; then
      echo "S3_ACCESS_KEY=s4admin" >> .env
    fi
    if ! grep -q "^S3_SECRET=" .env 2>/dev/null; then
      echo "S3_SECRET=s4secret" >> .env
    fi
    if ! grep -q "^S3_ENDPOINT=" .env 2>/dev/null; then
      echo "S3_ENDPOINT=http://localhost:9000" >> .env
    fi
    if ! grep -q "^S4_PROXY_ENDPOINT=" .env 2>/dev/null; then
      echo "S4_PROXY_ENDPOINT=http://koku-s4-proxy:7480" >> .env
    fi

    # Apple Silicon: the default S4 image is amd64; prefer the arm64 build when
    # present so Podman does not need qemu emulation for the object store.
    # Overridable: set S4_IMAGE in .env before -k, or export it in the shell.
    if [[ "$(uname -m)" == "arm64" ]] && ! grep -q "^S4_IMAGE=" .env 2>/dev/null; then
      echo "S4_IMAGE=quay.io/dnakabaa/s4:0.3.2-arm64" >> .env
    fi

    sed -e "s|^[# ]*AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=local-dev|" \
        -e "s|^[# ]*AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=local-dev|" \
        -e "s|^[# ]*CURRENCY_URL=.*|CURRENCY_URL=https://open.er-api.com/v6/latest/USD|" \
        -e "s|^[# ]*GROUP_ID=.*|GROUP_ID=$(id -g)|" \
        -e "s|^[# ]*KOKU_API_PATH_PREFIX=.*|KOKU_API_PATH_PREFIX='/api/cost-management'|" \
        -e "s|^[# ]*MASU_API_PATH_PREFIX=.*|MASU_API_PATH_PREFIX='/api/cost-management'|" \
        -e "s|^[# ]*ONPREM=.*|ONPREM=${ONPREM_VALUE}|" \
        -e "s|^[# ]*S3_ACCESS_KEY=.*|S3_ACCESS_KEY=s4admin|" \
        -e "s|^[# ]*S3_SECRET=.*|S3_SECRET=s4secret|" \
        -e "s|^[# ]*S3_ENDPOINT=.*|S3_ENDPOINT=http://localhost:9000|" \
        -e "s|^[# ]*S4_PROXY_ENDPOINT=.*|S4_PROXY_ENDPOINT=http://koku-s4-proxy:7480|" \
        -e "s|^[# ]*UNLEASH_ADMIN_TOKEN=.*|UNLEASH_ADMIN_TOKEN=*:*.unleash-insecure-api-token|" \
        -e "s|^[# ]*UNLEASH_TOKEN=.*|UNLEASH_TOKEN=default:development.unleash-insecure-api-token|" \
        -e "s|^[# ]*USER_ID=.*|USER_ID=$(id -u)|" .env > .env.tmp

    mv .env.tmp .env
  fi
}

# Create a fresh Python 3.11 virtualenv for the koku repo using pipenv.
# Always deletes the existing .venv first to ensure a clean, reproducible install.
kokuVEnv() {
  cd "$KOKU_DIR" || exit 1

  echo "*** Deleting Koku virtual env..."
  rm -rf .venv

  # If a koku/.venv is already active, pipenv will use its Python instead of 3.11.
  # Force pipenv to ignore any active virtualenv and use the correct Python.
  export PIPENV_IGNORE_VIRTUALENVS=1

  # PIPENV_PYTHON pins to 3.11 even if homebrew's default is newer.
  # PIPENV_VENV_IN_PROJECT puts the venv inside the repo at .venv.
  export PIPENV_PYTHON="python3.11"
  export PIPENV_VENV_IN_PROJECT=1

  echo -e "\n*** Creating Koku virtual env..."
  $PIPENV_BIN install --dev

  echo -e "\n*** Installing pre-commit hooks..."
  $PIPENV_BIN run pre-commit install
}

# Start the full koku backend stack via podman compose and wait for the API.
# Applies a compose override for a Podman quirk with worker port ranges.
#
# We deliberately avoid `compose up` dependency health waits (depends_on:
# condition: service_healthy / compose --wait). With Podman + docker-compose,
# those waits can hang indefinitely even after containers are healthy
# (commonly on `up -d unleash`). Dependencies are started with --no-deps and
# polled directly instead.
kokuServices() {
  cd "$KOKU_DIR" || exit 1

  # Podman quirk: koku-worker maps host ports 6001-6020 to container port 9000.
  # Podman rejects port ranges ("strconv.Atoi: parsing "6001-6020": invalid
  # syntax"). Clear published ports entirely so we can also scale workers during
  # data load without host-port collisions.
cat <<- EEOOFF > $PODMAN_OVERRIDE_FILE
services:
  koku-worker:
    ports: !reset
EEOOFF

  # Export USER_ID and GROUP_ID so docker-compose.yml's ${USER_ID:?} / ${GROUP_ID:?}
  # resolve correctly for direct $PODMAN_COMPOSE calls. The koku Makefile sets these automatically
  # (via `id -u` / `id -g`), but $PODMAN_COMPOSE invocations that bypass make leave them unset.
  export USER_ID=$(id -u)
  export GROUP_ID=$(id -g)

  # Non-empty AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY keep Trino's Glue
  # connector from NPEing. koku uses hive/thrift locally, so dummy values
  # (local-dev) are fine — these are not the S4 S3_ACCESS_KEY/S3_SECRET pair.
  if [ -z "${AWS_ACCESS_KEY_ID:-}" ]; then
    export AWS_ACCESS_KEY_ID=local-dev
  fi
  if [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
    export AWS_SECRET_ACCESS_KEY=local-dev
  fi

  compose() {
    $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" "$@"
  }

  waitForHealthy() {
    local name=$1
    local max_wait=${2:-180}
    local elapsed=0
    echo "    waiting for $name to be healthy (up to ${max_wait}s)..."
    while [ "$elapsed" -lt "$max_wait" ]; do
      # Require Running=true. After OOM, Podman can still report Health=healthy
      # on an exited container — that must not count as ready.
      local running health
      running=$($PODMAN inspect --format '{{.State.Running}}' "$name" 2>/dev/null || echo false)
      health=$($PODMAN inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}running{{end}}' "$name" 2>/dev/null || echo missing)
      if [ "$running" = "true" ] && { [ "$health" = "healthy" ] || [ "$health" = "running" ]; }; then
        echo "    $name is $health"
        return 0
      fi
      echo -n "."
      sleep 2
      elapsed=$(( elapsed + 2 ))
    done
    echo -e "\nError: $name did not become healthy within ${max_wait}s (running=$running health=$health)"
    $PODMAN logs --tail 40 "$name" 2>&1 || true
    return 1
  }

  waitForHttp() {
    local url=$1
    local max_wait=${2:-120}
    local elapsed=0
    echo "    waiting for $url (up to ${max_wait}s)..."
    while [ "$elapsed" -lt "$max_wait" ]; do
      if curl -sf --max-time 3 "$url" >/dev/null 2>&1; then
        echo "    $url is ready"
        return 0
      fi
      echo -n "."
      sleep 2
      elapsed=$(( elapsed + 2 ))
    done
    echo -e "\nError: $url did not respond within ${max_wait}s"
    return 1
  }

  waitForExit() {
    local name=$1
    local max_wait=${2:-60}
    local elapsed=0
    while [ "$elapsed" -lt "$max_wait" ]; do
      local status
      status=$($PODMAN inspect --format '{{.State.Status}}' "$name" 2>/dev/null || echo missing)
      if [ "$status" = "exited" ]; then
        local code
        code=$($PODMAN inspect --format '{{.State.ExitCode}}' "$name" 2>/dev/null || echo 1)
        if [ "$code" = "0" ]; then
          return 0
        fi
        echo "Error: $name exited with code $code"
        $PODMAN logs --tail 40 "$name" 2>&1 || true
        return 1
      fi
      sleep 1
      elapsed=$(( elapsed + 1 ))
    done
    echo "Error: $name did not exit within ${max_wait}s"
    return 1
  }

  echo -e "\n*** Building koku base image (first run can take several minutes)..."
  if ! $PIPENV_BIN run make DOCKER="$PODMAN" \
    COMPOSE_FILES="-f docker-compose.yml -f $PODMAN_OVERRIDE_FILE" \
    docker-host-dir-setup docker-build; then
    echo "Error: make docker-build failed"
    exit 1
  fi

  echo -e "\n*** Starting database..."
  compose up -d --no-deps db
  waitForHealthy koku-db 120 || exit 1

  echo -e "\n*** Starting Unleash..."
  compose up -d --no-deps unleash
  waitForHttp "http://localhost:4242/health" 120 || exit 1
  echo "*** Configuring Unleash flags..."
  if ! $PIPENV_BIN run $PYTHON_BIN dev/scripts/setup_unleash.py; then
    echo "Error: setup_unleash.py failed"
    exit 1
  fi

  echo -e "\n*** Starting S4 (object storage)..."
  compose up -d --no-deps s4-data-init
  # Compose names one-shot containers <project>-<service>-<n>
  local s4_init
  s4_init=$($PODMAN ps -a --format '{{.Names}}' | grep -E 's4-data-init' | head -1)
  if [ -n "$s4_init" ]; then
    waitForExit "$s4_init" 60 || exit 1
  fi
  compose up -d --no-deps s4
  waitForHealthy koku-s4 180 || exit 1
  compose up -d --no-deps s4-path-proxy
  waitForHealthy koku-s4-proxy 120 || exit 1

  echo -e "\n*** Creating S3 buckets..."
  if ! compose run --rm --no-deps create-s3-buckets; then
    echo "Error: create-s3-buckets failed"
    echo "Expected S4 credentials: S3_ACCESS_KEY=s4admin S3_SECRET=s4secret"
    echo "Re-run with -k to refresh .env, or: cd $KOKU_DIR && cp .env.example .env"
    exit 1
  fi

  echo -e "\n*** Starting Hive metastore and Trino..."
  compose up -d --no-deps hive-metastore
  compose up -d --no-deps trino
  waitForHealthy trino 180 || exit 1

  echo -e "\n*** Starting Valkey, koku-server, masu-server, and worker..."
  compose up -d --no-deps valkey
  compose up -d --no-deps koku-base
  compose up -d --no-deps koku-server
  compose up -d --no-deps masu-server
  compose up -d --no-deps --scale koku-worker=1 koku-worker

  echo -e "\n*** To check all services are up, run:"
cat <<- EEOOFF
  $PODMAN_COMPOSE -f docker-compose.yml -f $PODMAN_OVERRIDE_FILE ps
EEOOFF

  runCommand
  if [ -n "$RUN_COMMAND" ];then
    compose ps
  fi

  # Fail fast if the API container never started (e.g. make aborted mid-stack).
  # Compose names the container koku_server (underscore).
  if ! $PODMAN ps --format '{{.Names}}' | grep -qx 'koku_server'; then
    echo "Error: koku_server container is not running"
    echo "Check logs: cd $KOKU_DIR && $PODMAN logs --tail 80 koku_server"
    exit 1
  fi

  echo -e "\n*** To verify koku-server API responds, run:"
cat <<- EEOOFF
  curl -s http://localhost:8000/api/cost-management/v1/status/ | python3 -m json.tool
EEOOFF

  # Fresh DB after -c runs all Django migrations on first boot; 3 minutes is often
  # not enough. Allow up to 5 minutes and surface container logs on timeout.
  MAX_WAIT=300 # seconds total before giving up
  MAX_WAIT_MIN=$(( MAX_WAIT / 60 ))
  POLL_INTERVAL=2 # seconds between health-check attempts
  MAX_TRIES=$(( MAX_WAIT / POLL_INTERVAL ))
  SERVER_UP=
  TRIES=0

  echo -e "\n*** Waiting for koku-server to be ready (up to ${MAX_WAIT_MIN} minutes)..."
  while [ "$TRIES" -lt "$MAX_TRIES" ]; do
    if curl -sf http://localhost:8000/api/cost-management/v1/status/ >/dev/null 2>&1; then
      SERVER_UP=1; break
    fi
    echo -n "."; sleep "$POLL_INTERVAL"
    TRIES=$(( TRIES + 1 ))
  done
  if [ -z "$SERVER_UP" ]; then
    echo -e "\n*** koku-server did not respond after ${MAX_WAIT_MIN} minutes"
    echo "*** Recent koku_server logs:"
    $PODMAN logs --tail 40 koku_server 2>&1 || true
    exit 1
  fi

  # Also wait for masu-server (port 5042). load_test_customer_data.sh checks masu
  # with a single curl and exits immediately if it is not ready. masu depends on
  # trino being healthy, so it may lag koku-server.

  echo -e "\n*** To verify masu-server API responds, run:"
cat <<- EEOOFF
  curl -s http://localhost:5042/api/cost-management/v1/status/ | python3 -m json.tool
EEOOFF

  MASU_UP=
  TRIES=0

  echo -e "\n*** Waiting for masu-server to be ready (up to ${MAX_WAIT_MIN} minutes)..."
  while [ "$TRIES" -lt "$MAX_TRIES" ]; do
    if curl -sf http://localhost:5042/api/cost-management/v1/status/ >/dev/null 2>&1; then
      MASU_UP=1; break
    fi
    echo -n "."; sleep "$POLL_INTERVAL"
    TRIES=$(( TRIES + 1 ))
  done
  if [ -z "$MASU_UP" ]; then
    echo -e "\n*** masu-server did not respond after ${MAX_WAIT_MIN} minutes"
    echo "*** Recent masu_server logs:"
    $PODMAN logs --tail 40 masu_server 2>&1 || true
    exit 1
  fi

  echo -e "\n*** Services are up (see verify output at the end for status and shutdown)"
}

# Resolve a running koku-worker container name (compose may use -1, -2, …).
kokuWorkerContainer() {
  $PODMAN ps --format '{{.Names}}' 2>/dev/null | grep -E 'koku[-_]koku-worker' | head -n1
}

# Poll the sources API until the named source reports has_data=true.
# Returns 0 on success, 1 on timeout. Used after nise/masu ingest because
# load_test_customer_data.sh only waits ~8 minutes and may log a false failure
# while the worker is still summarizing.
waitForSourceHasData() {
  local source_name=$1
  local max_wait=${2:-600} # seconds
  local poll=10
  local elapsed=0
  local has_data=

  echo -e "\n*** Waiting for source \"$source_name\" to report has_data=true (up to $(( max_wait / 60 )) min)..."
  # Bust Django cache_page on /sources/ so we do not sit on stale has_data=false.
  $PODMAN exec koku_valkey valkey-cli FLUSHDB >/dev/null 2>&1 || true
  while [ "$elapsed" -lt "$max_wait" ]; do
    has_data=$(curl -sf "http://localhost:8000/api/cost-management/v1/sources/?type=OCP&limit=100&_ts=${elapsed}" 2>/dev/null | \
      $PYTHON_BIN -c "
import json, sys
name = sys.argv[1]
try:
    data = json.load(sys.stdin).get('data') or []
except Exception:
    data = []
for s in data:
    if s.get('name') == name:
        print('true' if s.get('has_data') else 'false')
        break
else:
    print('missing')
" "$source_name" 2>/dev/null || echo "error")

    if [ "$has_data" = "true" ]; then
      echo "  \"$source_name\" has_data=true"
      return 0
    fi
    echo -n "."
    sleep "$poll"
    elapsed=$(( elapsed + poll ))
  done
  echo -e "\n*** Timed out waiting for \"$source_name\" (last status: $has_data)"
  local worker
  worker=$(kokuWorkerContainer)
  if [ -n "$worker" ] && $PODMAN logs --since 30m "$worker" 2>/dev/null | grep -q 'HIVE_PATH_ALREADY_EXISTS'; then
    echo "Worker logs show Trino HIVE_PATH_ALREADY_EXISTS — stale S4/Hive warehouse data."
    echo "Re-run with a full wipe: npm run quick:start:koku   # includes -c"
    echo "Or: cd $KOKU_DIR && make DOCKER=\"$PODMAN\" docker-down && $PODMAN volume rm -f koku-s4-data"
  fi
  return 1
}

# Print name/type/has_data for every source (used by verify and ensureAllSourcesHaveData).
printSourcesHasData() {
  if ! curl -sf --max-time 10 'http://localhost:8000/api/cost-management/v1/sources/?limit=100' 2>/dev/null | \
    $PYTHON_BIN -c "
import json, sys
try:
    data = json.load(sys.stdin).get('data') or []
except Exception:
    print('  (unable to parse sources response)')
    sys.exit(1)
if not data:
    print('  (no sources found)')
    sys.exit(0)
print(f\"  {'name':<36} {'type':<12} has_data\")
print('  ' + '-' * 56)
for s in sorted(data, key=lambda x: ((x.get('source_type') or ''), (x.get('name') or ''))):
    name = s.get('name') or ''
    stype = s.get('source_type') or ''
    has = 'true' if s.get('has_data') else 'false'
    print(f'  {name:<36} {stype:<12} {has}')
ok = sum(1 for s in data if s.get('has_data'))
print(f'  {ok}/{len(data)} sources have data')
"; then
    echo "  (API not reachable — is koku-server up?)"
    return 1
  fi
}

# Names of sources that still have has_data=false.
# On-prem mode only requires "Test OCP on Premises"; full mode requires every source.
sourcesMissingData() {
  local mode_filter=${1:-}
  curl -sf --max-time 10 'http://localhost:8000/api/cost-management/v1/sources/?limit=100' 2>/dev/null | \
    $PYTHON_BIN -c "
import json, sys
mode = sys.argv[1]
try:
    data = json.load(sys.stdin).get('data') or []
except Exception:
    sys.exit(0)
if mode == 'onprem':
    data = [s for s in data if s.get('name') == 'Test OCP on Premises']
for s in data:
    if not s.get('has_data'):
        print(s.get('name') or '')
" "$mode_filter" 2>/dev/null
}

# Map a source name to the load-test-customer-data test_source value to reload it.
providerForSource() {
  case "$1" in
    "Test OCP on Premises") echo ONPREM ;;
    "Test OCP on AWS"|"Test AWS Source") echo AWS ;;
    "Test OCP on Azure"|"Test Azure Source"|"Test Azure v2 Source") echo AZURE ;;
    "Test OCP on GCP"|"Test OCP on GCP duplicate"|"Test GCP Source"|"Test OCPGCP Source") echo GCP ;;
    *) echo "" ;;
  esac
}

# True when a container is actually running and healthy (or has no healthcheck).
# Podman keeps the last Health.Status after OOM/exit — e.g. trino can show
# Health=healthy while State.Running=false. Never trust health alone.
isContainerUsable() {
  local name=$1
  local running health
  running=$($PODMAN inspect --format '{{.State.Running}}' "$name" 2>/dev/null || echo false)
  [ "$running" = "true" ] || return 1
  health=$($PODMAN inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}running{{end}}' "$name" 2>/dev/null || echo missing)
  [ "$health" = "healthy" ] || [ "$health" = "running" ]
}

# Ensure Trino is running and healthy (common cause of late OCP has_data=false).
ensureTrinoHealthy() {
  if isContainerUsable trino; then
    return 0
  fi

  local running oom
  running=$($PODMAN inspect --format '{{.State.Running}}' trino 2>/dev/null || echo false)
  oom=$($PODMAN inspect --format '{{.State.OOMKilled}}' trino 2>/dev/null || echo false)
  echo "*** Trino is not usable (running=$running oom_killed=$oom) — recreating..."

  # Force recreate: `start` after OOM often leaves a broken container; recreate
  # re-attaches DNS so workers can resolve host `trino` again.
  if [ -f "$PODMAN_OVERRIDE_FILE" ]; then
    $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" \
      up -d --no-deps --force-recreate trino >/dev/null 2>&1 \
      || $PODMAN start trino >/dev/null 2>&1 \
      || true
  else
    $PODMAN start trino >/dev/null 2>&1 || $PODMAN restart trino >/dev/null 2>&1 || true
  fi

  local elapsed=0
  local max_wait=180
  while [ "$elapsed" -lt "$max_wait" ]; do
    if isContainerUsable trino; then
      echo "    trino is usable"
      return 0
    fi
    echo -n "."
    sleep 2
    elapsed=$(( elapsed + 2 ))
  done
  echo -e "\nError: trino did not become usable within ${max_wait}s"
  $PODMAN logs --tail 40 trino 2>&1 || true
  return 1
}

# Poll until every required source has has_data=true (or timeout).
waitForAllSourcesHaveData() {
  local max_wait=${1:-600}
  local mode_filter=${2:-}
  local poll=15
  local elapsed=0
  local missing=

  echo -e "\n*** Waiting for all required sources to report has_data=true (up to $(( max_wait / 60 )) min)..."
  $PODMAN exec koku_valkey valkey-cli FLUSHDB >/dev/null 2>&1 || true

  while [ "$elapsed" -lt "$max_wait" ]; do
    # Trino often OOMs during multi-cloud ingest; revive it so in-flight
    # Premises/OCP summary can finish instead of sitting on processing=failed.
    if ! isContainerUsable trino; then
      echo -e "\n  trino went down during wait — recovering..."
      ensureTrinoHealthy || true
    fi

    missing=$(sourcesMissingData "$mode_filter" | tr '\n' ' ' | sed 's/[[:space:]]*$//')
    if [ -z "$missing" ]; then
      echo "  all required sources have data"
      printSourcesHasData || true
      return 0
    fi
    if [ $(( elapsed % 60 )) -eq 0 ]; then
      echo "  still waiting on: $missing"
    else
      echo -n "."
    fi
    sleep "$poll"
    elapsed=$(( elapsed + poll ))
  done

  echo -e "\n*** Timed out; sources still without data:"
  sourcesMissingData "$mode_filter" | sed 's/^/  - /'
  printSourcesHasData || true
  return 1
}

# After load, require has_data for all expected sources. If any are missing,
# fix common failures (Trino down, stale Hive paths) and reload only the
# provider groups that still need data.
ensureAllSourcesHaveData() {
  local load_fn=$1   # name of function that accepts a test_source arg
  local mode_filter=
  if [ -n "$MODE_ONPREM" ]; then
    mode_filter=onprem
  fi

  local round
  for round in 1 2 3; do
    # Trino OOM/exits mid-load leave late OCP sources stuck forever — fix first.
    if ! ensureTrinoHealthy; then
      echo "Error: Trino is required for OCP summary / has_data"
      return 1
    fi

    if waitForAllSourcesHaveData 600 "$mode_filter"; then
      return 0
    fi

    local missing
    missing=$(sourcesMissingData "$mode_filter")
    if [ -z "$missing" ]; then
      return 0
    fi

    echo -e "\n*** Remediation round $round/3 for sources without data:"
    echo "$missing" | sed 's/^/  - /'

    # Free RAM before reload — Trino is often OOM-killed while 3 workers +
    # multi-cloud ingest are running. Premises reload needs Trino alive.
    echo "*** Scaling koku-worker to 1 to free memory for Trino..."
    if [ -f "$PODMAN_OVERRIDE_FILE" ]; then
      $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" \
        up -d --no-deps --scale koku-worker=1 koku-worker >/dev/null 2>&1 || true
    fi
    if ! ensureTrinoHealthy; then
      echo "Error: Trino is required for OCP summary / has_data"
      return 1
    fi

    local worker
    worker=$(kokuWorkerContainer)
    if [ -n "$worker" ] && $PODMAN logs --since 60m "$worker" 2>/dev/null | grep -q 'HIVE_PATH_ALREADY_EXISTS'; then
      echo "*** Detected HIVE_PATH_ALREADY_EXISTS — clearing stale Hive paths..."
    fi
    # Clear orphans before reload (summary can fail when Trino died mid-create).
    clearStaleHivePaths

    # Unique provider reloads for the missing sources (AWS / AZURE / GCP / ONPREM).
    local providers=""
    local name prov
    while IFS= read -r name; do
      [ -z "$name" ] && continue
      prov=$(providerForSource "$name")
      if [ -n "$prov" ] && ! echo " $providers " | grep -q " $prov "; then
        providers="$providers $prov"
      fi
    done <<< "$missing"

    if [ -z "$(echo "$providers" | tr -d ' ')" ]; then
      echo "Error: could not map missing sources to a reload provider"
      return 1
    fi

    for prov in $providers; do
      echo -e "\n*** Reloading test_source=$prov after remediation..."
      "$load_fn" "$prov"
    done
  done

  if ! ensureTrinoHealthy; then
    return 1
  fi
  if waitForAllSourcesHaveData 300 "$mode_filter"; then
    return 0
  fi

  echo "Error: not all required sources have has_data=true after remediation"
  echo "Check: trino status, worker logs, and S4/Hive warehouse"
  return 1
}

# Remove leftover Hive managed-table objects under the local S4 warehouse.
# CREATE TABLE IF NOT EXISTS only checks the metastore; an orphaned S3 path makes
# Trino fail with HIVE_PATH_ALREADY_EXISTS and OCP has_data never becomes true.
# Deletes go to koku-s4 directly (path proxy remaps list keys and can no-op deletes).
# Only restart S4 when objects were removed (RGW can keep ghost LIST entries).
clearStaleHivePaths() {
  echo -e "\n*** Clearing stale Hive warehouse paths in S4 (if any)..."
  local worker
  worker=$(kokuWorkerContainer)
  if [ -z "$worker" ]; then
    echo "    no koku-worker container found; skipping"
    return 0
  fi
  local deleted_count
  deleted_count=$($PODMAN exec "$worker" python - <<'PY' || echo 0
import boto3
from botocore.client import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://koku-s4:7480",
    aws_access_key_id="s4admin",
    aws_secret_access_key="s4secret",
    config=Config(signature_version="s3v4"),
)
bucket = "koku-bucket"
# Physical short paths from koku/dev/containers/s4-path-proxy/path_maps.yaml
prefixes = [f"1/{i}/" for i in range(1, 13)]
total = 0
for prefix in prefixes:
    token = None
    while True:
        kw = {"Bucket": bucket, "Prefix": prefix, "MaxKeys": 1000}
        if token:
            kw["ContinuationToken"] = token
        resp = s3.list_objects_v2(**kw)
        objs = [{"Key": c["Key"]} for c in resp.get("Contents") or []]
        if objs:
            s3.delete_objects(Bucket=bucket, Delete={"Objects": objs, "Quiet": True})
            total += len(objs)
        if not resp.get("IsTruncated"):
            break
        token = resp["NextContinuationToken"]
print(total)
PY
)
  deleted_count=${deleted_count:-0}
  # Keep only trailing digits if python printed warnings before the count.
  deleted_count=$(echo "$deleted_count" | tr -cd '0-9\n' | tail -n1)
  deleted_count=${deleted_count:-0}
  if [ "$deleted_count" -gt 0 ] 2>/dev/null; then
    echo "    deleted $deleted_count stale object(s); restarting S4 to refresh LIST index..."
    $PODMAN restart koku-s4 >/dev/null 2>&1 || true
    sleep 5
  else
    echo "    no stale managed-table objects found"
  fi
}

# Create a test customer account and seed sample cost data.
# On-prem mode (-o): ONPREM=True + test_source=ONPREM (OCP only).
# Default mode: ONPREM=False + test_source=all (one koku load). Do not call
# load once per cloud — each provider already waits ~8 min inside koku for its
# OCP has_data; stacking that with another 15 min outer wait made full mode
# take an hour+.
loadData() {
  cd "$KOKU_DIR" || exit 1

  # Drop orphaned Hive warehouse paths from prior failed summaries before nise
  # upload. Otherwise OCP summary hits HIVE_PATH_ALREADY_EXISTS immediately.
  clearStaleHivePaths

  # Must call the script directly with --api-prefix. The koku .env sets
  # API_PATH_PREFIX=/api/cost-management; without the flag the script sends
  # requests to /api/v1/... which returns 404 every time.
  echo -e "\n*** Creating test customer (org_id: 1234567, username: test_customer) and providers..."
  $PIPENV_BIN run $PYTHON_BIN dev/scripts/create_test_customer.py --api-prefix /api/cost-management

  # Scale workers for OCP ingest. Override clears published ports so scale>1
  # does not collide on host bindings. Keep at 2 in full mode — 3 workers plus
  # Trino during test_source=all often OOM-kills Trino before Premises finishes.
  local worker_scale=2
  echo -e "\n*** Scaling koku-worker to ${worker_scale} for data load..."
  # --no-deps: stack is already up. Without it, Podman+docker-compose can hang
  # forever waiting on dependency health (often after "koku-koku-base-1 Started").
  $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" \
    up -d --no-deps --scale koku-worker="$worker_scale" koku-worker

  scaleWorkersDown() {
    echo -e "\n*** Scaling koku-worker back to 1..."
    $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" \
      up -d --no-deps --scale koku-worker=1 koku-worker >/dev/null 2>&1 || true
  }

  loadProvider() {
    local test_source=$1
    echo -e "\n*** Loading sample cost data (test_source=$test_source, ONPREM=${ONPREM_VALUE})..."
    echo "    (koku may log has_data timeouts after ~8 min per OCP source; that is often OK)"
    if ! $PIPENV_BIN run make DOCKER="$PODMAN" load-test-customer-data test_source="$test_source"; then
      echo "load-test-customer-data ($test_source) returned an error — waiting for worker..."
    fi
  }

  if [ -n "$MODE_ONPREM" ]; then
    loadProvider ONPREM
  else
    # Single koku load (AWS→Azure→GCP→ONPREM inside the script).
    loadProvider all
    # Premises is last in test_source=all and often fails when Trino was
    # OOM-killed during cloud ingest. Free RAM and revive Trino before the
    # has_data gate remediates with an ONPREM reload.
    echo -e "\n*** Recovering Trino after multi-cloud load (often OOM-killed)..."
    scaleWorkersDown
    if ! ensureTrinoHealthy; then
      echo "Error: Trino did not recover after data load"
      exit 1
    fi
    $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" \
      up -d --no-deps --scale koku-worker=2 koku-worker >/dev/null 2>&1 || true
  fi

  # Require has_data for every expected source. Remediates Trino/Hive failures
  # and reloads only the provider groups that are still missing data.
  if ! ensureAllSourcesHaveData loadProvider; then
    echo "Check worker logs: cd $KOKU_DIR && $PODMAN_COMPOSE logs --tail 80 koku-worker"
    scaleWorkersDown
    exit 1
  fi

  scaleWorkersDown

  echo -e "\n*** Data seeded — all required sources have has_data=true"
}

# Create or update nise/.env. When -n is passed, sets KOKU_PATH to point at the
# local koku repo so nise can resolve koku's cost model definitions at runtime.
niseEnv()
{
  cd $NISE_DIR

  if [[ ! -f .env && -n "$NISE_ENV" ]]; then
    echo -e "\n*** Copying $NISE_DIR/.env.example..."
    cp .env.example .env
  fi

  if [ ! -f .env ]; then
    echo "Error: $NISE_DIR/.env not found"
    echo "Create it: cd $NISE_DIR && cp .env.example .env"
    exit 1
  fi

  if [ -n "$NISE_ENV" ]; then
    echo "*** Updating $NISE_DIR/.env file..."
    sed -e "s|KOKU_PATH=.*|KOKU_PATH=$KOKU_DIR|" .env > .env.tmp
    mv .env.tmp .env
  fi
}

# Build nise from source using uv so the exact version in the repo is used
# rather than a pinned release, ensuring compatibility with the local koku checkout.
niseVEnv() {
  cd $NISE_DIR

  echo -e "\n*** Creating NISE virtual env"
  rm -rf .venv

  # Warm the uv env / verify nise installs; hide -h usage text so it is not
  # mistaken for an error.
  if ! uv run nise -h >/dev/null 2>&1; then
    echo "Error: uv run nise failed. Check that uv and the nise checkout are working."
    exit 1
  fi
  uv build
}

# In verbose mode (-v), prompt the user before running the next command.
# Clears RUN_COMMAND to skip, or leaves it set to proceed.
runCommand() {
  if [ -n "$VERBOSE" ]; then
    echo -e "\n*** Would you like to run this command now?"
    echo "Your choice [n/Y]:"
    read -r ANSWER
    case $ANSWER in
      [Nn]*) RUN_COMMAND=;;
      *) RUN_COMMAND=1;;
    esac
  fi
}

# Print post-setup status: running services, endpoints, Trino CLI, and shutdown.
verify() {
  cd "$KOKU_DIR" || exit 1

  echo -e "\n*** Running services:"
  # Include the podman override used at startup so compose finds the same project.
  if [ -f "$PODMAN_OVERRIDE_FILE" ]; then
    if ! $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" ps; then
      $PODMAN ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
    fi
  elif ! $PODMAN_COMPOSE ps; then
    $PODMAN ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
  fi

  echo -e "\n*** Endpoints:"
cat <<- EEOOFF
  Koku API      -> http://localhost:8000/api/cost-management/v1/status/
  MASU          -> http://localhost:5042
  PostgreSQL    -> localhost:15432
  Valkey        -> localhost:6379
  Unleash       -> http://localhost:4242
  S4 (S3)       -> http://localhost:9000  (proxy; UI http://localhost:5002)
  Trino         -> http://localhost:8080
  Hive metastore-> localhost:9083

  Logs:         -> cd $KOKU_DIR && $PODMAN_COMPOSE logs -f koku-server koku-worker
EEOOFF

  echo -e "\n*** To access the Trino CLI, run:"
cat <<- EEOOFF
  $PODMAN exec -it trino trino --server 127.0.0.1:8080 --catalog hive --schema org1234567 --user admin --debug

  Example usage:
    SHOW tables;
    SELECT * from aws_line_items LIMIT 10;
EEOOFF

  echo -e "\n*** To shut down the stack, run:"
cat <<- EEOOFF
  cd $KOKU_DIR
  $PODMAN_COMPOSE down       # stop containers, keep volumes/data
  $PODMAN_COMPOSE down -v    # stop and wipe DB, S4, and other volumes
EEOOFF
}

# main()
{
  trap cleanup SIGINT SIGTERM EXIT

  default

  # Check if podman is running
  if ! $PODMAN machine list | grep -q Currently; then
    echo "Error: podman not running"
    exit 1
  fi

  while getopts hcknov z; do
    case $z in
      c) CLEAN=1;;
      k) KOKU_ENV=1;;
      n) NISE_ENV=1;;
      o) MODE_ONPREM=1;;
      v) VERBOSE=1; RUN_COMMAND=;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

  if [ -n "$MODE_ONPREM" ]; then
    ONPREM_VALUE=True
    echo "*** Mode: on-prem (ONPREM=True, test_source=ONPREM)"
  else
    ONPREM_VALUE=False
    echo "*** Mode: full / SaaS-local (ONPREM=False, test_source=all)"
  fi

  if [ -n "$CLEAN" ]; then
    clean
  fi

  prereqs

  # NISE steps
  niseEnv
  niseVEnv

  # Koku steps
  kokuEnv
  kokuVEnv
  kokuServices

  # Data
  loadData
  verify

  frontend
}
