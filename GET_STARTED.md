# Getting Started

koku-ui is the frontend for [Red Hat Cost Management](https://console.redhat.com/openshift/cost-management).
It is a React monorepo that federates pages from three apps into one UI.
The backend API lives in [project-koku/koku](https://github.com/project-koku/koku).

This guide covers setting up the full dev environment on a Mac — backend API in Podman containers and frontend UI from the monorepo.

> **Platform note:** This guide covers macOS only (Intel and Apple silicon). We do not currently maintain steps for Linux or Windows — without a machine to test on, we cannot ensure those instructions stay correct. Contributions for other platforms are welcome.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Git | any | `xcode-select --install` |
| Podman Desktop | 4+ | <https://podman-desktop.io/> |
| Node.js | 22+ | <https://nodejs.org/> or [nvm](https://github.com/nvm-sh/nvm) |
| npm | 11+ | ships with Node.js |
| curl | any | pre-installed on macOS |
| make | any | `xcode-select --install` |
| Python | **3.11 exactly** | `brew install python@3.11` |
| pipenv | any | `pip3 install pipenv` |

> **Node.js version note:** The frontend apps currently use Node 24 LTS in production.
> Node 22 is the minimum supported version for this local dev workflow. If you already
> have Node 24 installed, it will work — you do not need to downgrade.

> **Why Podman?** Red Hat does not carry a Docker Desktop license. Podman is the supported container runtime for this project. Podman Desktop provides a drop-in CLI — `podman` commands work the same way as `docker`, and the koku Makefile detects Podman automatically.

> **pipenv PATH note:** `pip3 install pipenv` on macOS puts the binary in `~/Library/Python/3.11/bin/`, which is not in PATH by default. Add it once:
>
> ```bash
> echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
> source ~/.zprofile
> ```
>
> The setup script searches this path automatically, so you can skip this step and still run the script — but adding it lets you run pipenv directly from any terminal.

---

## Development Paths

There are two ways to run the frontend locally. Both require the koku backend running in Podman containers.

### Path A — koku-ui-onprem (experimental)

koku-ui-onprem creates a build of koku-ui-hccm and koku-ui-ros and runs them together in a standalone webpack Module Federation environment. This bypasses Red Hat SSO entirely — no login required.

> **What "onprem" means:** koku-ui-onprem is not simply a "no login" version of the SaaS
> UI. It is a genuinely different build with meaningful functional differences:
>
> - **Omits** SaaS-only libraries and functionality (e.g., Red Hat notification service)
> - **Includes** a **Sources tab** in the Settings page for adding integrations directly
>   (this tab does not exist in the SaaS build — see [PR #4977](https://github.com/project-koku/koku-ui/pull/4977))
> - Designed for customers running Cost Management in self-managed / on-premises OpenShift
>
> For local backend development and feature testing, it is the recommended path.
> For UI changes that must match the SaaS experience exactly, use Path B.

> **Experimental.** koku-ui-onprem was not originally designed as a local dev
> workflow. In practice, federated-module debugging works — koku-ui-ros source
> is visible in DevTools and edits to koku-ui-hccm trigger live updates.
> Useful for testing backend changes without a Red Hat SSO account.

```bash
npm run start:onprem    # http://localhost:9000  (no login)
```

- Proxies `/api/cost-management/v1/*` to `localhost:8000`
- Federates page components from koku-ui-hccm and koku-ui-ros at runtime
- Source maps work — breakpoints in koku-ui-hccm source are supported
- HMR works — edits to `apps/koku-ui-hccm/src/` reload in the browser

### Path B — direct koku-ui-hccm (standard)

The standard workflow. Requires a Red Hat SSO account with Cost Management permissions.

```bash
npm run start:hccm      # https://stage.foo.redhat.com:1337
```

Or against a local Koku API with Keycloak:

```bash
npm run -w @koku-ui/koku-ui-hccm start:local:api   # http://localhost:1337
```

Both paths edit the same source files in `apps/koku-ui-hccm/src/`.

---

## Quick Start (Automated)

Run the setup script from the `koku-ui` directory after installing the
prerequisites above. First run takes 10–15 minutes — most of that is
pulling ~1–2 GB of container images.

### Step 1 — Install prerequisites

These steps cannot be automated.

```bash
# Homebrew — install first if not already present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# On Apple silicon: follow the instructions it prints about adding brew to PATH.

# Podman Desktop — download from https://podman-desktop.io/
# After installing, open Podman Desktop and start the Podman machine.
# Verify:
#   podman info   # must return machine info without errors

# Node.js 22+
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source ~/.zprofile
nvm install 22 && nvm use 22

# Python 3.11 exactly
brew install python@3.11

# pipenv — install using python3.11 explicitly to avoid version mismatch
python3.11 -m pip install pipenv
# The pipenv binary lands in ~/Library/Python/3.11/bin/ — add it to PATH once:
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Clone both repos — they don't need to be siblings.
# By default the script looks for koku at ../koku.
# To use a different path, set KOKU_DIR before running:
#   export KOKU_DIR=/your/path/to/koku
# Uses SSH — verify your key first:
#   ssh -T git@github.com
# No SSH key? Use HTTPS instead:
#   git clone https://github.com/project-koku/koku.git
#   git clone https://github.com/project-koku/koku-ui.git
mkdir -p ~/code && cd ~/code
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git

# Create koku's .env from the example file — required before running Compose.
# Without this file, the setup script fails with "required variable UNLEASH_TOKEN is missing".
cd koku && cp .env.example .env
# USER_ID and GROUP_ID are required by koku's docker-compose.yml.
echo "USER_ID=$(id -u)" >> .env
echo "GROUP_ID=$(id -g)" >> .env
cd ../koku-ui
```

> **⚠ macOS Docker credential conflict:** If you have (or ever had) Docker Desktop installed,
> `~/.docker/config.json` may reference `"credsStore": "desktop"`. This causes Podman's
> image builds to fail with:
>
> ```
> error listing credentials — err: exec: "docker-credential-desktop": executable file not found in $PATH
> ```
>
> **Fix:** Rename or delete the file before running the setup script:
>
> ```bash
> mv ~/.docker/config.json ~/.docker/config.json.bak
> ```
>
> Your existing credentials are preserved in the `.bak` file. If you never had Docker
> Desktop installed, ignore this warning.

### Step 2 — Check prerequisites before running

Run these from inside the `koku-ui` directory. All five must succeed.

```bash
podman info                  # must not say "Cannot connect"
node --version               # must print v22.x or higher
python3.11 --version         # must print Python 3.11.x
pipenv --version || python3.11 -m pipenv --version
ls "${KOKU_DIR:-../koku}/Pipfile"   # confirms koku repo can be found
```

> If `pipenv --version` says "command not found" but the second form works, pipenv is installed but not in PATH yet. The setup script finds it automatically — you can still proceed.

### Step 3 — Run the setup script

Run from inside the `koku-ui` directory.

```bash
cd ~/code/koku-ui

# If koku is NOT at ../koku (i.e. not a sibling), set this first:
#   export KOKU_DIR=~/koku   # or wherever you cloned it

# If you have a koku-ui .venv already active (e.g. from a previous session),
# set this to prevent pipenv from using the wrong Python version:
#   export PIPENV_IGNORE_VIRTUALENVS=1

bash scripts/setup-get-started.sh
```

Before starting any long-running work the script prompts once:

```
Load sample AWS/Azure/GCP/OCP cost data? [y/N]
```

Answer `y` on first run so report pages show data. Answer `n` for a faster
setup — data can be loaded later with `--load-data`.

Output on success:

```
==> Checking prerequisites
  ✓ Podman 5.x
  ✓ Node v22.x  npm v10.x
  ✓ pipenv 2026.x
  ✓ Python 3.11.x
  ✓ koku repo at ../koku
==> Setting up backend
  ✓ Python dependencies installed
  ✓ pre-commit hooks installed
  ✓ Containers started
  ✓ Trino started
  ✓ koku-server is up at http://localhost:8000
  ✓ Test customer created (org_id: 1234567, username: test_customer)
  ✓ Data seeded — worker is processing in the background
  ✓ Host port 9000 freed — webpack devServer can now bind to port 9000
==> Installing npm dependencies
  ✓ npm dependencies installed
  ✓ apps/koku-ui-onprem/.env created
==> Done
```

> **Note on `[400] Bad Request` during source creation:** If you see 400 errors
> in the output above, this is normal and expected on re-runs. Koku intentionally
> rejects duplicate sources with the message "An integration already exists with
> these details." The sources were created successfully on the first run — 400s
> on subsequent runs mean the data is already there. The script continues safely.

> **Why "Host port 9000 freed"?** MinIO (the object storage service) binds `localhost:9000` by default — the same port webpack uses for the dev server. The script moves MinIO off that port after data loading completes. MinIO's web console remains at <http://localhost:9090>.

### Step 4 — Verify the backend is running

Before starting the frontend, confirm the koku backend is healthy.
If these fail, do not proceed to the frontend — the UI will show errors.

```bash
curl http://localhost:8000/api/cost-management/v1/status/
# Expected output: {"status":"OK"}
```

If it returns `Connection refused`, the containers are not running:

```bash
cd ~/code/koku
podman compose start
# Wait 30 seconds then try the curl again
curl http://localhost:8000/api/cost-management/v1/status/
```

### Step 5 — Start the frontend

**Path A (experimental, no login):**

```bash
npm run start:onprem
```

Open <http://localhost:9000>. The first build takes about 60 seconds.

**Path B (standard, requires Red Hat SSO):**

```bash
npm run start:hccm
```

Open <https://stage.foo.redhat.com:1337/openshift/cost-management>.

> **Note:** Running `koku-ui-hccm` in SaaS mode (Path B) requires a Red Hat SSO account,
> additional environment setup, and a podman image. Full instructions are in the app's
> own README:
>
> - [koku-ui-hccm README](https://github.com/project-koku/koku-ui/blob/main/apps/koku-ui-hccm/README.md)
> - [koku-ui-ros README](https://github.com/project-koku/koku-ui/blob/main/apps/koku-ui-ros/README.md)

Verify end-to-end (Path A):

```bash
curl http://localhost:9000/
curl http://localhost:9000/api/cost-management/v1/status/   # should return {"status":"OK"}
```

---

## Resuming development

The setup script only needs to run once.

**Start the backend** (if Podman Desktop was closed):

```bash
cd ~/code/koku
podman compose start
curl http://localhost:8000/api/cost-management/v1/status/
```

**Start the frontend:**

```bash
cd ~/code/koku-ui
npm run start:onprem   # or npm run start:hccm
```

Re-run the setup script only if you:

- Deleted container volumes (`podman compose down -v`)
- Cloned a fresh copy on a new machine
- Need to reset the database and re-seed data

---

## What the script does

| Automated by the script | Must be done manually |
|----------------|-------------------|
| `pipenv install --dev` | Install Podman Desktop |
| `pre-commit install` | Install Node.js |
| Pull container images (~1–2 GB first time) | Install Python 3.11 |
| Start all backend containers | Install pipenv |
| Fix Trino empty-credential crash | Clone the koku repo |
| Wait up to 3 min for migrations | Set up SSH key for GitHub |
| Create test customer account | |
| Optionally load sample cost data | |
| Free host port 9000 from MinIO | |
| Create `apps/koku-ui-onprem/.env` | |
| Warn if `/etc/hosts` is missing proxy entries | |

The script is safe to re-run: containers that are already running are not restarted, and the `.env` file is never overwritten.

### Script flags

```bash
bash scripts/setup-get-started.sh --skip-backend   # skip backend, run frontend steps only
bash scripts/setup-get-started.sh --skip-frontend  # skip frontend, run backend steps only
bash scripts/setup-get-started.sh --load-data      # load sample data without prompting
bash scripts/setup-get-started.sh --skip-data      # skip sample data without prompting
bash scripts/setup-get-started.sh --help           # show usage
```

---

## Repo layout

This is a monorepo with three apps and two shared libraries.

```
koku-ui/
├── apps/
│   ├── koku-ui-hccm/       ← cost-management pages (OpenShift, AWS, GCP, Azure, Settings)
│   ├── koku-ui-onprem/     ← webpack dev server + API proxy (no page components)
│   └── koku-ui-ros/        ← Optimizations page only
└── libs/
    ├── ui-lib/             ← shared React components
    └── onprem-cloud-deps/  ← shared PatternFly singletons for Module Federation
```

### koku-ui-hccm

Every cost page in the UI is a component from this app. If you are adding a feature — a new group-by option, filter, or API field — your changes go in `apps/koku-ui-hccm/src/`.

In production this app is served on `console.redhat.com`. Locally it is built by the on-prem dev server — you do not run it standalone.

### koku-ui-onprem

This app has no page-level React components. It does three things:

1. Runs the webpack dev server on `localhost:9000`. This port is fixed.
2. Proxies every `/api/cost-management/v1/*` request to `localhost:8000`. The proxy target comes from `apps/koku-ui-onprem/.env`.
3. Loads page components from koku-ui-hccm and koku-ui-ros at runtime via webpack Module Federation.

The only file you ever touch here:

```
apps/koku-ui-onprem/.env    ← gitignored, created by the setup script
```

```ini
API_PROXY_URL=http://localhost:8000/api/cost-management/v1
API_TOKEN=
```

Changes to this file require restarting `npm run start:onprem`.

### koku-ui-ros

Contains only the Optimizations page, owned by a separate team on a different release schedule. Unless you are working on Optimizations, you will not touch this app.

### How the three apps connect locally

```
npm run start:onprem
│
├── koku-ui-onprem  →  localhost:9000 (shell + proxy + Module Federation host)
│        │
│        ├── Proxy: /api/cost-management/v1/* → localhost:8000 (koku backend)
│        ├── Federates koku-ui-hccm pages (OpenShift, AWS, Settings …)
│        └── Federates koku-ui-ros pages  (Optimizations)
│
├── koku-ui-hccm  →  apps/koku-ui-hccm/dist/
└── koku-ui-ros   →  apps/koku-ui-ros/dist/
```

Example: you click **OpenShift** → the hccm component loads → calls `GET /api/cost-management/v1/reports/openshift/costs/` → the on-prem proxy forwards it to `localhost:8000` → koku returns data → the component renders the cost table.

---

## Manual setup

Use this section if the script failed partway through and you need to run steps individually, or if you want a minimal environment without Trino.

### 1. Clone the repos

```bash
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git
```

Both repos are cloned as siblings here for convenience, but they do not need to be. Set `KOKU_DIR=/path/to/koku` before running the setup script to use any location.

### 2. Backend

#### Install Python dependencies

```bash
cd koku
pipenv install --dev
pipenv shell
pre-commit install
```

All commands below run inside this pipenv shell. If you exit the shell, re-run `pipenv shell` before continuing.

#### Start backend containers

The koku Makefile uses:

```makefile
DOCKER := $(shell which docker 2>/dev/null || which podman 2>/dev/null)
```

On a machine with Docker installed, `which docker` wins. Pass `DOCKER=podman` explicitly so Podman is always used.

Podman's Docker-compat API also rejects two things in koku's `docker-compose.yml`:

1. `koku-worker` maps host ports `6001-6020` to container port 9000 — Podman rejects port ranges with `strconv.Atoi: parsing "6001-6020": invalid syntax`.
2. `trino` uses a legacy `links:` directive — Podman rejects it with `bad parameter: link is not supported`.

Work around both with a temporary compose override:

```bash
cat > /tmp/koku-podman-ovr.yml << 'EOF'
services:
  koku-worker:
    ports: !reset
      - "6001:9000"
      - "5678:5678"
  trino:
    links: !reset
EOF

COMPOSE_FILE="docker-compose.yml:/tmp/koku-podman-ovr.yml" \
  make DOCKER="$(command -v podman)" docker-up-min-trino

rm /tmp/koku-podman-ovr.yml
```

`docker-up-min-trino` starts PostgreSQL, Valkey, Unleash, koku-server, koku-worker, Trino, MinIO, and Hive metastore. The target name is historical — it runs with Podman.

First run pulls ~1–2 GB of images. Subsequent starts are fast.

Check containers:

```bash
podman ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

#### Create a test customer and load data

```bash
python dev/scripts/create_test_customer.py --api-prefix /api/cost-management
make DOCKER="$(command -v podman)" load-test-customer-data
```

The `--api-prefix` flag is required — without it the script hits `/api/v1/...` and gets 404s. `load-test-customer-data` seeds sample rows for AWS, Azure, GCP, and OCP; the worker processes them in the background.

> **Note on re-runs:** The `create_test_customer.py` script is idempotent — if you run it a second time and a source already exists, you'll see `[400] Bad Request` errors in the output. This is normal and expected. The script logs these but continues without failing, so re-running the setup script is safe.

> **MinIO port-rebind:** After data loading completes, MinIO is still bound to `localhost:9000`. The automated script frees it after data load. If following the manual path, you'll hit "address already in use" when you later run `npm run start:onprem`. The troubleshooting section below covers how to free it manually.

#### Verify the backend

```bash
curl http://localhost:8000/api/cost-management/v1/status/
# {"status":"OK"}
```

#### Backend service URLs

| Service | URL |
|---------|-----|
| Koku API | <http://localhost:8000> |
| MASU | <http://localhost:5042> |
| PostgreSQL | localhost:15432 (user: `koku`, db: `koku`) |

### 3. Frontend

#### Add hosts entries (Path B only)

```bash
sudo bash -c 'echo "127.0.0.1 prod.foo.redhat.com" >> /etc/hosts'
sudo bash -c 'echo "127.0.0.1 stage.foo.redhat.com" >> /etc/hosts'
# or:
npm run -w @koku-ui/koku-ui-hccm patch:hosts
```

#### Install dependencies

```bash
cd koku-ui
npm install
```

#### Path A — on-prem shell (no login)

Create the proxy config:

```bash
cat > apps/koku-ui-onprem/.env <<'EOF'
API_PROXY_URL=http://localhost:8000/api/cost-management/v1
API_TOKEN=
EOF
```

Start the dev server:

```bash
npm run start:onprem
```

Open <http://localhost:9000>.

#### Path B — Red Hat stage environment

```bash
npm run start:hccm
```

Open <https://stage.foo.redhat.com:1337/openshift/cost-management> and log in with a Red Hat account that has Cost Management permissions.

#### Path C — local Koku API

```bash
npm run -w @koku-ui/koku-ui-hccm start:local:api
```

Open <http://localhost:1337/openshift/cost-management>. Keycloak on port 4020 handles auth.

### 4. Logs

```bash
cd koku
podman compose logs -f koku-server koku-worker
```

### 5. Stopping and cleaning up

```bash
cd koku
make DOCKER="$(command -v podman)" docker-down   # stops containers and removes volumes
podman system prune --all                         # optional: reclaim disk space
```

`make docker-down` runs `podman compose down -v --remove-orphans` — this removes containers, networks, and volumes including the database. Re-run the test data steps after this.

---

## Troubleshooting

### Reports show no data

The worker processes ingested data asynchronously. After `make DOCKER="$(command -v podman)" load-test-customer-data`, wait a minute or two. Check progress:

```bash
podman compose logs -f koku-worker
```

### `localhost:9000` shows a blank page

`apps/koku-ui-onprem/.env` is probably missing. Create it:

```bash
echo 'API_PROXY_URL=http://localhost:8000/api/cost-management/v1' > apps/koku-ui-onprem/.env
```

Restart `npm run start:onprem`.

### Browser shows 504 on API calls

The frontend proxies `/api/cost-management/v1/*` to `localhost:8000`. If the backend is stopped, every request times out.

This usually happens after Podman Desktop quits. Containers stop but are not deleted — no data is lost.

```bash
cd koku
podman compose start
curl http://localhost:8000/api/cost-management/v1/status/
```

Reload the browser. No need to restart the frontend.

### Port 8000 already in use

```bash
lsof -i :8000
```

If it is a leftover koku container, run `make DOCKER="$(command -v podman)" docker-down` then start again.

### Trino exits immediately after startup

Trino's Glue connector requires non-empty AWS credentials. If your shell or `koku/.env` has `AWS_ACCESS_KEY_ID=` (blank), Trino crashes with:

```
NullPointerException: Access key ID cannot be blank
```

koku uses a local hive/thrift metastore, not AWS Glue, so the value just needs to be non-empty. Restart Trino with a placeholder:

```bash
cd koku
cat > /tmp/trino-ovr.yml << 'EOF'
services:
  trino:
    links: !reset
EOF
AWS_ACCESS_KEY_ID=local-dev AWS_SECRET_ACCESS_KEY=local-dev \
  podman compose -f docker-compose.yml -f /tmp/trino-ovr.yml up -d --no-deps --force-recreate trino
rm /tmp/trino-ovr.yml
```

The `links: !reset` override is required because Podman rejects the legacy `links:` directive in koku's `docker-compose.yml`. The setup script handles both this and the credential fix automatically.

### Unleash fails to start — "Admin token cannot be scoped to single project"

The `UNLEASH_ADMIN_TOKEN` in `koku/.env` has the wrong format. Admin tokens must use `*:*` scope. Fix it:

```bash
# Remove the wrong line and add the correct one
grep -v "^UNLEASH_ADMIN_TOKEN=" ~/koku/.env > /tmp/env.tmp && mv /tmp/env.tmp ~/koku/.env
echo "UNLEASH_ADMIN_TOKEN=*:*.unleash-insecure-api-token" >> ~/koku/.env
```

Then restart:

```bash
cd ~/koku && podman compose down -v
cd ~/koku-ui && bash scripts/setup-get-started.sh
```

### Stage login fails or returns 403

Your Red Hat account needs the Cost Management role in the stage environment. Ask your org admin or create a test account at <https://access.stage.redhat.com>.

### <a name="podman-apple-silicon"></a>Podman on Apple silicon

If you see `The server port 9998 is already in use`:

```bash
podman machine stop
podman machine rm
podman machine init --image docker://quay.io/podman/machine-os:5.5
podman machine start
```

### Clearing the API cache

Koku caches responses in Valkey. To flush after manually changing DB rows:

```bash
podman compose exec valkey valkey-cli flushall
```

### `npm run start:onprem` says "address already in use"

Something is on port 9000. Find it:

```bash
lsof -i :9000
```

Kill it:

```bash
lsof -ti :9000 | xargs kill -9 2>/dev/null
```

If it is `koku-minio`, the MinIO port-rebind did not complete. Free it manually:

```bash
cd ~/code/koku
cat > /tmp/minio-fix.yml << 'EOF'
services:
  minio:
    ports: !reset
      - "9090:9090"
EOF
podman compose -f docker-compose.yml -f /tmp/minio-fix.yml up -d --no-deps --force-recreate minio
rm /tmp/minio-fix.yml
```

Then retry `npm run start:onprem`.

### Re-running the setup script after a failed attempt

If the setup script failed partway through on a previous run, leftover containers
may cause the next run to fail with different errors.

**Recommended fix before re-running:**

```bash
cd ~/code/koku
make DOCKER="$(command -v podman)" docker-down
```

This removes containers, networks, and volumes (including the database).
After this, re-run the setup script from scratch:

```bash
cd ~/code/koku-ui
bash scripts/setup-get-started.sh
```

> **Warning:** `docker-down` deletes all data in the local database.
> Only do this when you want a completely fresh start.
