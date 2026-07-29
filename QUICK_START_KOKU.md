# Quick Start — Koku Backend with Local UI

This guide covers setting up the Koku backend API with sample cost data so you can run it alongside the Koku UI frontend for local development and testing.

> **Platform note:** This guide covers macOS only (Intel and Apple silicon). We do not currently maintain steps for Linux or Windows. Contributions for other platforms are welcome.

---

## Overview

This workflow involves three repositories:

| Repo | Purpose |
|------|---------|
| [project-koku/koku](https://github.com/project-koku/koku) | Backend API — Python/Django, runs in Podman containers |
| [project-koku/nise](https://github.com/project-koku/nise) | Test data generator — seeds sample cost reports into koku |
| [project-koku/koku-ui](https://github.com/project-koku/koku-ui) | This repo — React monorepo, serves the UI |

The setup script (`scripts/quick-start-koku.sh`) automates the backend setup. Once it completes, you start the frontend with a single npm command. The frontend proxies all API calls to the local koku server at `localhost:8000`.

### The onprem build

The `start:quick:start:koku` / `start:quick:start:koku:onprem` npm scripts start the **koku-ui-onprem** build, which differs from the SaaS build in a few meaningful ways:

- **No login required** — skips Red Hat SSO entirely, which is ideal for local backend testing
- **Sources tab** — enabled for `start:quick:start:koku:onprem` (on-prem Settings); disabled for `start:quick:start:koku` to match SaaS-local (see [PR #4977](https://github.com/project-koku/koku-ui/pull/4977))
- **Omits** SaaS-only libraries such as the Red Hat notification service
- Designed for customers running Cost Management in self-managed / on-premises OpenShift

For local backend development and feature testing, this is the recommended path. For changes that must match the SaaS experience exactly, use the standard `start:hccm` workflow instead.

```bash
npm run start:quick:start:koku         # SaaS-local (data retention / Sources tab off)
npm run start:quick:start:koku:onprem  # on-prem (data retention / Sources tab on)
```

- Proxies `/api/cost-management/v1/*` to `localhost:8000`
- Federates page components from koku-ui-hccm and koku-ui-ros at runtime
- Source maps work — breakpoints in koku-ui-hccm source are supported
- HMR works — edits to `apps/koku-ui-hccm/src/` reload in the browser

---

## Prerequisites

| Tool           | Version          | Install |
|----------------|------------------|---------|
| Git            | any              | `xcode-select --install` |
| Homebrew       | any              | See [brew.sh](https://brew.sh/) |
| Podman Desktop | 4+               | <https://podman-desktop.io/> |
| Node.js        | 22+              | <https://nodejs.org/> or [nvm](https://github.com/nvm-sh/nvm) |
| npm            | 11+              | ships with Node.js |
| curl           | any              | pre-installed on macOS |
| make           | any              | `xcode-select --install` |
| Python         | **3.11 exactly** | `brew install python@3.11` |
| pipenv         | any              | `python3.11 -m pip install pipenv` |
| uv             | any              | `brew install uv` |
| bash           | 4+               | `brew install bash` |

> **Node.js version note:** The frontend apps currently use Node 24 LTS in production.
> Node 22 is the minimum supported version for this local dev workflow.

> **Why Podman?** Red Hat does not carry a Docker Desktop license. Podman is the supported container runtime for this project. Podman Desktop provides a drop-in CLI — `podman` commands work the same way as `docker`.

> **Podman memory:** Trino may fail to start with less than 8 GB of memory. Set memory and CPU allocations once:
>
> ```bash
> podman machine stop
> podman machine set --memory 8192 --cpus 4
> podman machine start
> ```

> **pipenv PATH note:** `python3.11 -m pip install pipenv` on macOS puts the binary in `~/Library/Python/3.11/bin/`, which is not in PATH by default. Add it once:
>
> ```bash
> echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
> source ~/.zprofile
> ```

---

## First-time Setup

### Step 1 — Install prerequisites

These steps cannot be automated.

```bash
# Homebrew — install first if not already present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# On Apple silicon: follow the instructions it prints about adding brew to PATH.

# Podman Desktop — download from https://podman-desktop.io/
# After installing, open Podman Desktop and start the Podman machine.
podman info   # must return machine info without errors

# Node.js 22+
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source ~/.zprofile
nvm install 22 && nvm use 22

# Python 3.11 exactly
brew install python@3.11

# uv — used by the nise test data generator
brew install uv

# pipenv — install using python3.11 explicitly to avoid version mismatch
python3.11 -m pip install pipenv
# The pipenv binary lands in ~/Library/Python/3.11/bin/ — add it to PATH once:
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# Clone repos — the script expects koku and nise as siblings of koku-ui
#
# Uses SSH — verify your key first:
#   ssh -T git@github.com
#
# No SSH key? Use HTTPS instead:
#   git clone https://github.com/project-koku/nise.git
#   git clone https://github.com/project-koku/koku.git
#   git clone https://github.com/project-koku/koku-ui.git
mkdir -p ~/code && cd ~/code
git clone git@github.com:project-koku/nise.git
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

> **By default the script looks for koku at `../koku` and nise at `../nise`.**
> To use different paths, set these variables before running the script:
>
> ```bash
> export KOKU_DIR=/your/path/to/koku
> export NISE_DIR=/your/path/to/nise
> ```

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

---

### Step 2 — Verify prerequisites

Run these from inside the `koku-ui` directory. All must succeed before proceeding.

```bash
bash --version                                            # must be 4.x or higher
node --version                                            # must print v22.x or higher
podman info                                               # must not say "Cannot connect"
podman machine inspect --format '{{.Resources.Memory}}'   # must be 8192 or higher
python3.11 --version                                      # must print Python 3.11.x
pipenv --version || python3.11 -m pipenv --version
uv --version
ls "${KOKU_DIR:-../koku}/Pipfile"                         # confirms koku repo can be found
ls "${NISE_DIR:-../nise}/pyproject.toml"                  # confirms nise repo can be found
```

> If `pipenv --version` says "command not found" but `python3.11 -m pipenv --version` works, pipenv is installed but not in PATH yet. The setup script finds it automatically — you can still proceed.

---

### Step 3 — Run the setup script

Run from inside the `koku-ui` directory. First run takes 10–15 minutes — most of that is
pulling ~1–2 GB of container images.

> **⚠ Warning:** Both quick-start targets include the `-c` (clean) flag.
> They delete all data in the local database and start fresh. Only use these
> when you want a clean environment. To resume an existing environment, see
> [Resuming Development](#resuming-development).

Choose the backend mode that matches how you will run the UI:

| npm target | Backend mode | Data loaded | Typical frontend |
|------------|--------------|-------------|------------------|
| `quick:start:koku` | `ONPREM=False`, `test_source=all` | AWS, Azure, GCP, OCP (incl. on-prem) | `start:quick:start:koku` or `start:hccm` with local API proxy |
| `quick:start:koku:onprem` | `ONPREM=True`, `test_source=ONPREM` | On-prem OCP only | `start:quick:start:koku:onprem` |

```bash
cd ~/code/koku-ui
npm run quick:start:koku          # full / SaaS-local providers
# or
npm run quick:start:koku:onprem   # on-prem OCP only
```

Equivalent direct invocations:

```bash
bash scripts/quick-start-koku.sh -c -k -n       # full
bash scripts/quick-start-koku.sh -c -k -n -o    # on-prem (-o)
```

Expected output on success:

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
==> Installing npm dependencies
  ✓ npm dependencies installed
  ✓ apps/koku-ui-onprem/.env created
==> Done
```

> **Note on `[400] Bad Request` during source creation:** If you see 400 errors
> in the output, this is normal on re-runs. Koku intentionally rejects duplicate
> sources with the message "An integration already exists with these details."
> The sources were created successfully on the first run — 400s on subsequent
> runs mean the data is already there. The script continues safely.

---

### Step 4 — Verify the backend

Before starting the frontend, confirm the koku backend is healthy.
If these fail, do not proceed — the UI will show errors.

```bash
curl http://localhost:8000/api/cost-management/v1/status/
# Expected: {"status":"OK"}
```

If it returns `Connection refused`, the containers are not running:

```bash
cd ~/code/koku
podman compose start
# Wait 30 seconds then try the curl again
curl http://localhost:8000/api/cost-management/v1/status/
```

---

### Step 5 — Start the frontend

```bash
cd ~/code/koku-ui
npm run start:quick:start:koku         # after quick:start:koku
# or
npm run start:quick:start:koku:onprem  # after quick:start:koku:onprem
```

Open <http://localhost:9001>. The first build takes about 60 seconds.

Verify end-to-end:

```bash
curl http://localhost:9001/
curl http://localhost:9001/api/cost-management/v1/status/   # should return {"status":"OK"}
```

---

## Resuming Development

The setup script only needs to run once. On subsequent sessions, the containers and data persist — just restart them.

Re-run the setup script only if you:

- Deleted container volumes (`podman compose down -v`)
- Cloned a fresh copy on a new machine
- Need to reset the database and re-seed data

**Start the backend** (if Podman Desktop was closed):

```bash
cd ~/code/koku
podman compose start
curl http://localhost:8000/api/cost-management/v1/status/
```

**Start the frontend:**

```bash
cd ~/code/koku-ui
npm run start:quick:start:koku         # SaaS-local
# or
npm run start:quick:start:koku:onprem  # on-prem
```

---

## Reference

### What the script does

| Automated by the script                    | Must be done manually          |
|--------------------------------------------|--------------------------------|
| `pipenv install --dev`                     | Install Podman Desktop         |
| `pre-commit install`                       | Install Node.js                |
| Create `../nise/.env`                      | Install Python 3.11            |
| Create/update `../koku/.env`               | Install pipenv and uv          |
| Pull container images (~1–2 GB first time) | Clone the koku and nise repos  |
| Start all backend containers               | Set up SSH key for GitHub      |
| Refresh S4 / currency `.env` values        |                                |
| Wait up to 5 min for migrations            |                                |
| Create test customer account               |                                |
| Load sample cost data via nise             |                                |
| Wait until all required sources have has_data=true |                                |

### Script flags

```text
bash scripts/quick-start-koku.sh [-h|-c|-k|-n|-o|-v]

    h    Display the usage message
    c    Clean previous build (removes containers and all data — destructive)
    k    Create or update koku/.env
    n    Create or update nise/.env
    o    On-prem mode (ONPREM=True, test_source=ONPREM); default is full/all
    v    Verbose (interactive) mode — prompts before running each command
```

Run the script with `-h` to print this message at any time:

```bash
bash scripts/quick-start-koku.sh -h
```

### Useful commands

**Check all container statuses:**

```bash
cd ~/code/koku
podman compose ps
```

**Follow worker logs** (useful when waiting for data to be processed):

```bash
podman compose logs -f koku-worker
```

**Access the Trino CLI** (query the local data warehouse directly):

```bash
podman exec -it trino trino \
  --server 127.0.0.1:8080 \
  --catalog hive \
  --schema org1234567 \
  --user admin \
  --debug
```

Example Trino queries:

```sql
SHOW tables;
SELECT * FROM aws_line_items LIMIT 10;
```

**Flush the API cache** (after manually changing database rows):

```bash
podman compose exec valkey valkey-cli flushall
```

---

## Troubleshooting

### Container(s) failed to start

1. Increase memory to 8GB (8192MB) and give podman more CPUs if possible.

```bash
podman machine stop
podman machine set --memory 8192 --cpus 4
podman machine start
```

### Koku server is not available

Wait up to 3 mins for koku-server to be ready. To verify koku-server API responds, run:

```bash
curl -s http://localhost:8000/api/cost-management/v1/status/ | python3 -m json.tool
```

### Masu server is not available

Masu depends on trino being healthy, so wait up to 3 mins. To verify masu-server API responds, run:

```bash
curl -s http://localhost:5042/api/cost-management/v1/status/ | python3 -m json.tool
```

### Reports show no data

The worker processes ingested data asynchronously. After the setup script completes, wait a minute or two before expecting report pages to show rows. Check progress:

```bash
podman compose logs -f koku-worker
```

### `localhost:9001` shows a blank page

The `start:quick:start:koku` / `start:quick:start:koku:onprem` npm scripts set the required environment variables inline. If you are running the frontend a different way and see a blank page, verify these are set:

```bash
export API_PROXY_URL=http://localhost:8000/api/cost-management/v1
export API_TOKEN=
```

Then restart `npm run start:quick:start:koku` (or `start:quick:start:koku:onprem`).

### Browser shows 504 on API calls

The frontend proxies `/api/cost-management/v1/*` to `localhost:8000`. If the backend is stopped, every request times out. This usually happens after Podman Desktop quits — containers stop but are not deleted, so no data is lost.

```bash
cd ~/code/koku
podman compose start
curl http://localhost:8000/api/cost-management/v1/status/
```

Reload the browser. No need to restart the frontend.

### Port 8000 already in use

```bash
lsof -i :8000
```

If it is a leftover koku container, run:

```bash
cd ~/code/koku
make DOCKER="$(command -v podman)" docker-down
```

Then start again.

### Stale test containers on port 15432

The setup script checks for leftover test containers before starting. If it prints an error about port 15432 being in use, remove the stale containers:

```bash
cd ~/code/koku
podman compose down -v
```

Then re-run the setup script.

### Script hangs on Unleash / “still bringing up stack”

Unleash itself usually starts in under a minute (`curl http://localhost:4242/health` → `{"health":"GOOD"}`). If the script sits much longer, Podman’s `docker-compose up -d unleash` is likely stuck on a dependency health wait even though the container is already up.

Ctrl+C and re-run with the latest `scripts/quick-start-koku.sh` (it starts services with `--no-deps` and polls health directly).

### Script hangs after “Scaling koku-worker” / `koku-koku-base-1 Started`

Same Podman + docker-compose issue: scaling workers without `--no-deps` waits on dependency health and can hang forever. Current quick-start uses `--no-deps` for worker scale up/down. Ctrl+C a hung run and re-run with the updated script.

### `has_data` never becomes true / `HIVE_PATH_ALREADY_EXISTS`

If the loader logs `Failed to find has_data=true for source_name Test OCP on AWS` and worker logs show:

```
TrinoExternalError: HIVE_PATH_ALREADY_EXISTS
Target directory for table 'org1234567.reporting_ocpusagelineitem_daily_summary' already exists
```

the S4 volume still has Hive warehouse objects from a previous run while the metastore does not. OCP summary fails immediately, so `has_data` stays false.

Fix with a full wipe (the `-c` flag now removes `koku-s4-data`), then re-run:

```bash
cd ~/code/koku
make DOCKER="$(command -v podman)" docker-down
podman volume rm -f koku-s4-data
cd ~/code/koku-ui
npm run quick:start:koku
```

The setup script also clears known Hive managed-table prefixes in S4 before loading data.

### Trino exits immediately after startup

Trino's Glue connector requires non-empty AWS credentials. If your shell or `koku/.env` has `AWS_ACCESS_KEY_ID=` (blank), Trino crashes with:

```
NullPointerException: Access key ID cannot be blank
```

Koku uses a local hive/thrift metastore, not AWS Glue, so the value just needs to be non-empty. The setup script sets dummy values when run with `-k`. To fix manually:

```bash
cd ~/code/koku
# Ensure .env has non-empty AWS_* values (local-dev is fine; not S4's s4admin keys)
sed -i '' 's|^AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=local-dev|' .env
sed -i '' 's|^AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=local-dev|' .env
AWS_ACCESS_KEY_ID=local-dev AWS_SECRET_ACCESS_KEY=local-dev \
  podman compose up -d --no-deps --force-recreate trino
```

### S3 / create-s3-buckets fails with InvalidAccessKeyId

Koku replaced MinIO with S4. Legacy MinIO keys in `.env` (`kokuminioaccess` / `kokuminiosecret`) cause `make docker-up-min-trino` to fail during bucket creation, so `koku_server` never starts. Use the S4 defaults:

```bash
cd ~/code/koku
sed -i '' 's|^S3_ACCESS_KEY=.*|S3_ACCESS_KEY=s4admin|' .env
sed -i '' 's|^S3_SECRET=.*|S3_SECRET=s4secret|' .env
# Recreate the path proxy so it picks up the new keys
podman compose up -d --force-recreate s4-path-proxy
podman compose run --rm --no-deps create-s3-buckets
```

Or re-run the setup script with `-k` so it rewrites these values.

### `has_data=false` / "Failed to find has_data=true … after 50 retries"

That message comes from koku's `load_test_customer_data.sh`, which only waits
~8 minutes. It is **non-fatal inside koku** — the load script continues, and the
worker often finishes shortly afterward.

Our quick-start then waits until **all required sources** report `has_data=true`
(full mode: every source; on-prem mode: `Test OCP on Premises` only). If any are
still false, it remediates up to 3 times:

1. Scale workers down and **recreate Trino** if it is not running (Podman can still
   report `Health=healthy` after an OOM exit — the script checks `Running=true`)
2. Clear stale Hive warehouse paths in S4 when summary can fail on orphans
3. Reload only the provider group(s) still missing data (`AWS` / `AZURE` / `GCP` / `ONPREM`)

`Test OCP on Premises` is last in `test_source=all`, so it often fails when Trino
was OOM-killed during AWS/Azure/GCP ingest. After the multi-cloud load the script
recovers Trino before the has_data gate. Give Podman at least **8 GB** of memory.

Setup exits if sources are still without data after remediation.

`quick:start:koku` loads all cloud providers in one `test_source=all` pass.
`quick:start:koku:onprem` loads on-prem OCP only.

To check manually:

```bash
curl -s 'http://localhost:8000/api/cost-management/v1/sources/?limit=100' | python3 -m json.tool
```

### Broken host `aws` CLI / OCP payload "not found"

`load-test-customer-data` verifies OCP uploads with the host `aws` CLI. A stale
install (often under `~/Library/Python/3.7/bin/aws` with a missing interpreter)
fails that check even when nise uploaded successfully. Fix or remove it:

```bash
aws --version   # should print a version, not "bad interpreter"
# If broken:
mv ~/Library/Python/3.7/bin/aws ~/Library/Python/3.7/bin/aws.bak
# Optional: brew install awscli
```

The setup script skips non-working `aws` binaries and falls back to a Podman
`aws-cli` container for verification.

### Unleash fails to start — "Admin token cannot be scoped to single project"

The `UNLEASH_ADMIN_TOKEN` in `koku/.env` has the wrong format. Admin tokens must use `*:*` scope. Fix it:

```bash
# Remove the wrong line and add the correct one
grep -v "^UNLEASH_ADMIN_TOKEN=" ~/code/koku/.env > /tmp/env.tmp && mv /tmp/env.tmp ~/code/koku/.env
echo "UNLEASH_ADMIN_TOKEN=*:*.unleash-insecure-api-token" >> ~/code/koku/.env
```

Then re-run the setup script. The `-k` flag will write the correct token value automatically on subsequent runs.
