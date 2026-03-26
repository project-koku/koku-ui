#!/bin/sh

# ============================================================
# quick-start-koku.sh
# ============================================================
#
# Sets up the koku backend (API, worker, database, Trino) with
# sample cost data so you can develop and test koku-ui against
# the latest koku source without a Red Hat SSO account.
#
# Expected directory layout (overridable via env vars):
#   ../koku   -- project-koku/koku   (set KOKU_DIR to override)
#   ../nise   -- project-koku/nise   (set NISE_DIR to override)
#   .         -- project-koku/koku-ui (this repo)
#
# After this script completes, start the frontend with:
#   npm run start:onprem:koku   -> http://localhost:9001
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

  SCRIPT=`basename $0`
  SCRIPT_DIR=`dirname $0`
  SCRIPT_DIR=`cd $SCRIPT_DIR; pwd`
  TMP_DIR="/tmp/$SCRIPT.$$"

  mkdir $TMP_DIR

  # Run commands by default
  RUN_COMMAND=1

  # Podman
  PODMAN=`command -v podman`
  PODMAN_COMPOSE="$PODMAN compose"
  PODMAN_OVERRIDE_FILE=$TMP_DIR/koku-podman-override
  export PODMAN_COMPOSE_WARNING_LOGS=false

  # Homebrew prefix paths for tools used when building Python C extensions inside
  # the koku virtualenv. confluent-kafka links against librdkafka; cryptography
  # and psycopg2 require openssl headers; psycopg2 also needs the pg_config binary
  # from postgresql@16.
  LIBRDKAFKA_PREFIX=`brew --prefix librdkafka`
  OPENSSL_PREFIX=`brew --prefix openssl`
  POSTGRESQL_PREFIX=`brew --prefix postgresql@16`
  PYTHON_PREFIX=`brew --prefix python@3.11`

  export LDFLAGS="-L${OPENSSL_PREFIX}/lib -L${LIBRDKAFKA_PREFIX}/lib"
  export CPPFLAGS="-I${OPENSSL_PREFIX}/include -I${LIBRDKAFKA_PREFIX}/include"
  export PATH="$POSTGRESQL_PREFIX/bin:${PYTHON_PREFIX}/bin:$PATH"

  # Find Koku dirs
  if [ -z "$KOKU_UI_DIR" ]; then
    KOKU_UI_DIR=`cd $SCRIPT_DIR/..; pwd`
  fi
  if [ -z "$KOKU_DIR" ]; then
    KOKU_DIR=`cd $SCRIPT_DIR/../../koku; pwd`
  fi
  if [ -z "$NISE_DIR" ]; then
    NISE_DIR=`cd $SCRIPT_DIR/../../nise; pwd`
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
      VERSION=`$CANDIDATE --version 2>&1 | awk '{print $2}'`
      if [ "`echo "$VERSION" | cut -d. -f1,2`" = "3.11" ]; then
        PYTHON_BIN="$CANDIDATE"
        break
      fi
    fi
  done
}

# Verify that all required tools are installed and the environment is ready.
# Exits with a descriptive error message and install hint if any check fails.
prereqs() {
  # koku's Makefile and dev scripts require bash 4+. macOS ships with bash 3.2
  # (held at GPL2) — 'brew install bash' provides 5.x.
  BASH_VERSION=`bash --version | head -1 | awk '{print $4}' | awk -F. '{print $1}'`
  if [ "$BASH_VERSION" -lt 4 ]; then
    echo "Error: Bash version must be 4+"
    exit 1
  fi

  # Check for podman compose
  if ! podman compose version >/dev/null 2>&1; then
    echo "Error: podman compose not found"
    exit 1
  fi

  # Check memory
  MEMORY=`podman machine inspect --format '{{.Resources.Memory}}'`
  if [ "$MEMORY" -lt 8192 ]; then
    echo "Error: Set memory to 8GB (8192MB) and give it more CPUs, run:"
cat <<- EEOOFF
  $PODMAN machine stop
  $PODMAN machine set --memory 8192 --cpus 4
  $PODMAN machine start
EEOOFF
    exit 1
  fi

  # Check known macOS credential helper conflict.
  #
  # If the contributor has Docker Desktop installed (or ever had it installed),
  # ~/.docker/config.json may reference "credsStore": "desktop"
  #
  # Podman's docker-compat layer cannot call docker-credential-desktop and fails with:
  #  error listing credentials - err: exec: "docker-credential-desktop": executable file not found in $PATH
  #
  # The safe fix is to remove (or rename) ~/.docker so Podman uses its own credential store.
  if [ -d ~/.docker ]; then
    echo "Error: mv ~/.docker ~/.docker.bak"
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

  # Test Koku dir
  if [ ! -f "$KOKU_DIR/Pipfile" ]; then
    echo "Error: $KOKU_DIR not found"
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

  # Check for Node.js 22+
  NODE_MAJOR=`node --version 2>/dev/null | tr -d 'v' | cut -d. -f1`
  if [ -z "$NODE_MAJOR" ] || [ "$NODE_MAJOR" -lt 22 ]; then
    echo "Error: Node.js 22+ required (found: `node --version 2>/dev/null || echo 'not found'`)"
    echo "Install it: nvm install 22 && nvm use 22"
    exit 1
  fi

  # Check for make (used to start containers and load data)
  if ! command -v make >/dev/null 2>&1; then
    echo "Error: make not found. Install it: xcode-select --install"
    exit 1
  fi

  # Test nise dir
  if [ ! -f "$NISE_DIR/pyproject.toml" ]; then
    echo "Error: nise repo not found at $NISE_DIR"
    echo "Clone it: git clone git@github.com:project-koku/nise.git"
    exit 1
  fi

  # Test koku .env -- without it, podman compose aborts with "required variable UNLEASH_TOKEN is missing"
  if [ ! -f "$KOKU_DIR/.env" ]; then
    echo "Error: $KOKU_DIR/.env not found"
    echo "Create it: cd $KOKU_DIR && cp .env.example .env"
    exit 1
  fi
}

# Print usage information.
usage()
{
cat <<- EEOOFF

    Sets up the koku backend with sample cost data for local UI development.

    sh [-x] $SCRIPT [-h|-c|-k|-n|-v]

    OPTIONS:
    h       Display this message
    c       Clean previous build
    k       Create or update koku/.env
    n       Create or update nise/.env
    v       Verbose mode

EEOOFF
}

# Tear down the koku virtualenv and stop/remove containers from a previous run.
# Always destructive — removes volumes and all database data.
clean()
{
  cd $KOKU_DIR

  echo "*** Running make clean..."
  make clean >/dev/null 2>&1

  if [ -d .venv ]; then
    echo "*** Shutting down $PODMAN_COMPOSE..."
    $PODMAN_COMPOSE down >/dev/null 2>&1
  fi

  # If this is a re-run (containers from a previous attempt exist in a broken state),
  # Koku recommends running `make clean` first. We check for leftover Koku containers
  # and suggest a clean if found. We do NOT run clean automatically because it is
  # destructive (removes volumes and all data).
  CONTAINERS=`$PODMAN ps -a --format "{{.Names}}" 2>/dev/null | grep -c "^koku" || true`
  if [ "$CONTAINERS" -gt 0 ]; then
    echo "\n*** Found $CONTAINERS Koku container(s) from a previous run"
    echo "If this is a fresh start after a failed attempt, consider running:"
cat <<- EEOOFF
  make DOCKER="$PODMAN" docker-down
EEOOFF

    runCommand
    if [ -n "$RUN_COMMAND" ];then
      make DOCKER="$PODMAN" docker-down
    fi
  fi
}

# Signal handler registered via 'trap' in main.
# Removes the temp directory created by default() on SIGINT, SIGTERM, or EXIT.
cleanup()
{
  echo "\n*** Cleaning temp directory..."
  rm -rf $TMP_DIR
  exit 0
}

# Print the command to start the koku-ui-onprem frontend once the backend is ready.
frontend() {
  echo "\n*** To start the frontend, run:"

cat <<- EEOOFF
  npm run start:onprem:koku
    -> http://localhost:9001 no SSO login required
    -> proxies /api/cost-management/v1/* to your local koku backend
    -> runs koku-ui-hccm + koku-ui-ros via webpack Module Federation
EEOOFF
}

# Create or update koku/.env with values required for local development:
# local-dev AWS credentials, API path prefixes, Unleash tokens, and the
# current user/group IDs required by docker-compose.yml.
kokuEnv()
{
  cd $KOKU_DIR

  if [ ! -f .env ]; then
    echo "\n*** Copying .env.example..."
    cp .env.example .env
  fi

  if [ -n "$KOKU_ENV" ]; then
    echo "*** Updating koku/.env file..."

    # First pass: append any keys that are entirely absent from the file.
    # Second pass (sed below): overwrite all known keys to their local-dev values.
    # Together these handle both a freshly copied .env.example and a previously
    # customised .env without leaving stale or duplicate entries.
    if ! grep -q "AWS_ACCESS_KEY_ID=" .env 2>/dev/null; then
      echo "AWS_ACCESS_KEY_ID=local-dev" >> .env
    fi
    if ! grep -q "AWS_SECRET_ACCESS_KEY=" .env 2>/dev/null; then
      echo "AWS_SECRET_ACCESS_KEY=local-dev" >> .env
    fi
    if ! grep -q "KOKU_API_PATH_PREFIX=" .env 2>/dev/null; then
      echo "KOKU_API_PATH_PREFIX='/api/cost-management'" >> .env
    fi
    if ! grep -q "MASU_API_PATH_PREFIX=" .env 2>/dev/null; then
      echo "MASU_API_PATH_PREFIX='/api/cost-management'" >> .env
    fi
    if ! grep -q "GROUP_ID=" .env 2>/dev/null; then
      echo "GROUP_ID=`id -g`" >> .env
    fi
    if ! grep -q "USER_ID=" .env 2>/dev/null; then
      echo "USER_ID=`id -u`" >> .env
    fi
#    if ! grep -q "ONPREM=" .env 2>/dev/null; then
#      echo "ONPREM=True" >> .env
#    fi

#       -e "s|ONPREM=.*|ONPREM=True|" \
    sed -e "s|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=local-dev|" \
        -e "s|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=local-dev|" \
        -e "s|# GROUP_ID=.*|GROUP_ID=|" \
        -e "s|GROUP_ID=.*|GROUP_ID=`id -g`|" \
        -e "s|KOKU_API_PATH_PREFIX=.*|KOKU_API_PATH_PREFIX='/api/cost-management'|" \
        -e "s|MASU_API_PATH_PREFIX=.*|MASU_API_PATH_PREFIX='/api/cost-management'|" \
        -e "s|UNLEASH_ADMIN_TOKEN=.*|UNLEASH_ADMIN_TOKEN=*:*.unleash-insecure-api-token|" \
        -e "s|UNLEASH_TOKEN=.*|UNLEASH_TOKEN=default:development.unleash-insecure-api-token|" \
        -e "s|# USER_ID=.*|USER_ID=|" \
        -e "s|USER_ID=.*|USER_ID=`id -u`|" .env > .env.tmp

    mv .env.tmp .env
  fi
}

# Create a fresh Python 3.11 virtualenv for the koku repo using pipenv.
# Always deletes the existing .venv first to ensure a clean, reproducible install.
kokuVEnv() {
  cd $KOKU_DIR

  echo "*** Deleting Koku virtual env..."
  rm -rf .venv

  # If a koku/.venv is already active, pipenv will use its Python instead of 3.11.
  # Force pipenv to ignore any active virtualenv and use the correct Python.
  export PIPENV_IGNORE_VIRTUALENVS=1

  # PIPENV_PYTHON pins to 3.11 even if homebrew's default is newer.
  # PIPENV_VENV_IN_PROJECT puts the venv inside the repo at .venv.
  export PIPENV_PYTHON="python3.11"
  export PIPENV_VENV_IN_PROJECT=1

  echo "\n*** Creating Koku virtual env..."
  $PIPENV_BIN install --dev

  echo "\n*** Installing pre-commit hooks..."
  $PIPENV_BIN run pre-commit install
}

# Start the full koku backend stack via podman compose and wait up to 3 minutes
# for the API to become healthy. Applies compose overrides to work around two
# Podman quirks: port ranges and legacy 'links:' directives.
kokuServices() {
  cd $KOKU_DIR

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
cat <<- EEOOFF > $PODMAN_OVERRIDE_FILE
services:
  koku-worker:
    ports: !reset
      - "6001:9000"
      - "5678:5678"
  trino:
    links: !reset
EEOOFF

  # Export USER_ID and GROUP_ID so docker-compose.yml's ${USER_ID:?} / ${GROUP_ID:?}
  # resolve correctly for direct $PODMAN_COMPOSE calls. The koku Makefile sets these automatically
  # (via `id -u` / `id -g`), but $PODMAN_COMPOSE invocations that bypass make leave them unset.
  export USER_ID=`id -u`
  export GROUP_ID=`id -g`

  echo "\n*** Starting the full stack with Trino..."
  export COMPOSE_FILE="docker-compose.yml:$PODMAN_OVERRIDE_FILE"
  $PIPENV_BIN run make DOCKER="$PODMAN" docker-up-min-trino

  # Koku's .env sets AWS_ACCESS_KEY_ID= (empty string). Compose's
  # ${VAR-default} syntax only substitutes when the variable is UNSET, not empty,
  # so the blank value flows into Trino's Glue connector, which NPEs with
  # "Access key ID cannot be blank". koku uses hive/thrift, not AWS Glue, so a
  # dummy value is safe. Always force-recreate Trino with non-empty credentials.
  #
  # The PODMAN_OVERRIDE_FILE override (links: !reset) is reused here so the Trino
  # recreate doesn't hit the same Podman link-not-supported rejection.
  echo "\n*** Restarting Trino with local-dev credentials (Glue connector fix)"
  export AWS_ACCESS_KEY_ID=local-dev
  export AWS_SECRET_ACCESS_KEY=local-dev
  $PODMAN_COMPOSE -f docker-compose.yml -f "$PODMAN_OVERRIDE_FILE" up -d --no-deps --force-recreate trino 2>&1

  echo "\n*** To check all services are up, run:"
cat <<- EEOOFF
  $PODMAN_COMPOSE ps
EEOOFF

  runCommand
  if [ -n "$RUN_COMMAND" ];then
    $PODMAN_COMPOSE ps
  fi

  echo "\n*** To verify API responds, run:"
cat <<- EEOOFF
  curl -s http://localhost:8000/api/cost-management/v1/status/ | python3 -m json.tool
EEOOFF

  if [ -n "$VERBOSE" ]; then
    echo "\n*** Would you like to poll (up to 3 min) to ensure the API responds?"
    echo "Your choice [n/Y]:"
    read -r ANSWER
    case $ANSWER in
      [Nn]*) RUN_COMMAND=;;
      *) RUN_COMMAND=1;;
    esac
  fi
  if [ -n "$RUN_COMMAND" ];then
    SERVER_UP=
    TRIES=0
    MAX_WAIT=180 # seconds total before giving up
    POLL_INTERVAL=2 # seconds between health-check attempts
    MAX_TRIES=$(( MAX_WAIT / POLL_INTERVAL ))
    while [ "$TRIES" -lt "$MAX_TRIES" ]; do
      if curl -sf http://localhost:8000/api/cost-management/v1/status/ >/dev/null 2>&1; then
        SERVER_UP=1; break
      fi
      echo ".\c"; sleep "$POLL_INTERVAL"
      TRIES=`echo "$TRIES + 1" | bc`
    done
    if [ -z "$SERVER_UP" ]; then
      echo "\n*** koku-server did not respond after ${MAX_WAIT}s"
      exit 1
    fi
  fi

  echo "\n***"

cat <<- EEOOFF
  Koku API   -> http://localhost:8000/api/cost-management/v1/status/
  MASU       -> http://localhost:5042
  PostgreSQL -> localhost:15432 (user: koku, db: koku)

  Logs:      -> cd $KOKU_DIR && $PODMAN logs -f koku-server koku-worker
  Restart:   -> cd $KOKU_DIR && $PODMAN_COMPOSE start
EEOOFF
}

# Create a test customer account and seed sample cost data for all provider types
# (AWS, Azure, GCP, OCP). The koku-worker processes uploaded data asynchronously —
# reports may take a minute or two to populate after this function returns.
loadData() {
  cd $KOKU_DIR

  # Must call the script directly with --api-prefix. The koku .env sets
  # API_PATH_PREFIX=/api/cost-management; without the flag the script sends
  # requests to /api/v1/... which returns 404 every time.
  echo "\n*** Creating test customer (org_id: 1234567, username: test_customer) and providers..."
  $PIPENV_BIN run $PYTHON_BIN dev/scripts/create_test_customer.py --api-prefix /api/cost-management

  # Note: test_source=ONPREM times out and doesn't load OCP data
  # Using test_source=all will load OCP data, but produces empty tables for AWS, Azure, and GCP

  # koku-worker processes this asynchronously — wait a minute or two before expecting report pages to show rows.
  # This step uploads to MinIO at localhost:9000
  echo "\n*** Loading sample cost data..."
  $PIPENV_BIN run make DOCKER="$PODMAN" load-test-customer-data test_source=all || \
    echo "load-test-customer-data had errors (partial upload) — reports may show less data"

  echo "\n*** Data seeded — worker will process in the background..."
}

# Create or update nise/.env. When -n is passed, sets KOKU_PATH to point at the
# local koku repo so nise can resolve koku's cost model definitions at runtime.
niseEnv()
{
  cd $NISE_DIR

  if [ ! -f .env ]; then
    echo "\n*** Copying .env.example..."
    cp .env.example .env
  fi

  if [ -n "$NISE_ENV" ]; then
    echo "*** Updating nise/.env file..."
    sed -e "s|KOKU_PATH=.*|KOKU_PATH=$KOKU_DIR|" .env > .env.tmp
    mv .env.tmp .env
  fi
}

# Build nise from source using uv so the exact version in the repo is used
# rather than a pinned release, ensuring compatibility with the local koku checkout.
niseVEnv() {
  cd $NISE_DIR

  echo "\n*** Creating NISE virtual env"
  rm -rf .venv

  uv run nise -h
  uv build
}

# In verbose mode (-v), prompt the user before running the next command.
# Clears RUN_COMMAND to skip, or leaves it set to proceed.
runCommand() {
  if [ -n "$VERBOSE" ]; then
    echo "\n*** Would you like to run this command now?"
    echo "Your choice [n/Y]:"
    read -r ANSWER
    case $ANSWER in
      [Nn]*) RUN_COMMAND=;;
      *) RUN_COMMAND=1;;
    esac
  fi
}

# Print post-setup verification hints, including the Trino CLI command for
# querying the local data warehouse directly.
verify() {
  cd $KOKU_DIR

  echo "\n*** To access the Trino CLI, run:"
cat <<- EEOOFF
  $PODMAN exec -it trino trino --server 127.0.0.1:8080 --catalog hive --schema org1234567 --user admin --debug

  Example usage:
    SHOW tables;
    SELECT * from aws_line_items LIMIT 10;
EEOOFF
}

# main()
{
  trap cleanup SIGINT SIGTERM EXIT

  default

  while getopts hcknv z; do
    case $z in
      c) CLEAN=1;;
      k) KOKU_ENV=1;;
      n) NISE_ENV=1;;
      v) VERBOSE=1; RUN_COMMAND=;;
      h) usage; exit 0;;
      \?) usage; exit 1;;
    esac
  done

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
