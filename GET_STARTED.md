# Getting Started

How to get the Koku (Cost Management) dev environment running on your machine. Covers the backend API and frontend UI from scratch.


## Prerequisites

| Tool | Version | Install |
|------|---------|--------|
| Git | any | <https://git-scm.com/> |
| Docker (or Podman + docker-compose plugin) | Docker 20+ / Podman 4+ | <https://docs.docker.com/get-docker/> or <https://podman.io/docs/installation> |
| Node.js | 22.20+ | <https://nodejs.org/> — or use [nvm](https://github.com/nvm-sh/nvm) for easy version switching |
| npm | 10.x+ | ships with Node.js |
| curl | any | usually pre-installed; macOS: `brew install curl`, Linux: `apt-get install curl` / `dnf install curl` |
| make | any | macOS: `xcode-select --install`, Ubuntu/Debian: `sudo apt install build-essential`, Fedora/RHEL: `sudo dnf install make` |
| Python | **3.11 exactly** | macOS: `brew install python@3.11` — Ubuntu/Debian: `sudo apt install python3.11` — Fedora/RHEL: `sudo dnf install python3.11` |
| pipenv | any | `pip install pipenv` or `pip3 install --user pipenv` |

> **Windows users:** The setup script and Makefile require a Unix-like shell. Use **WSL 2** (Windows Subsystem for Linux) with Ubuntu 22.04 LTS.
> Open Windows Terminal, launch the Ubuntu profile, and follow all instructions from there.
> [How to install WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install)

> **PATH note for pipenv:**
>
> **macOS** — `pip install pipenv` puts the binary in `~/Library/Python/3.11/bin/`, not in PATH by default:
>
> ```
> echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
> source ~/.zprofile
> ```
>
> **Linux / WSL 2** — `pip install --user pipenv` puts the binary in `~/.local/bin/`:
>
> ```
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
> source ~/.bashrc
> ```
>
> The setup script searches these locations automatically, but adding pipenv to PATH lets you also run it directly.

If using Podman on Apple silicon, see the [known issue workaround](#podman-apple-silicon) in the troubleshooting section.

---

## Quick Start (Automated — Recommended for New Contributors)

Run **one script** that handles everything after the 5 prerequisites below are installed. First run takes 10–15 minutes (mostly Docker image downloads). You can step away once it starts asking for sample data.

### Step 1 — Install the prerequisites manually

These 5 things cannot be automated. Everything else is handled by the script.

**macOS**

```bash
# 0. Homebrew (macOS package manager — install this first if you don't have it)
#    Check: command -v brew && echo "already installed" || echo "not installed"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# After it finishes, follow any instructions it prints about adding brew to PATH.
# On Apple silicon (M1/M2/M3): run the eval line it prints to activate brew in this shell.

# 1. Docker Desktop — download the .dmg and install it:
#    https://docs.docker.com/desktop/mac/install/
#    After installing, open Docker Desktop and wait for the whale icon to turn green.

# 2. Node.js 22+ (nvm makes it easy to switch versions)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zprofile  # or open a new terminal tab
nvm install 22 && nvm use 22

# 3. Python 3.11 (must be exactly 3.11)
brew install python@3.11

# 4. pipenv + add it to PATH
pip3 install pipenv
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile

# 5. Clone both repos as siblings in the same parent folder
#    These commands use SSH (git@github.com:...). Verify your key works first:
#      ssh -T git@github.com   # should print "Hi <username>! You've successfully authenticated"
#    If you see "Permission denied (publickey)", set up an SSH key:
#      https://docs.github.com/en/authentication/connecting-to-github-with-ssh
#    Or clone with HTTPS instead (no SSH key needed):
#      git clone https://github.com/project-koku/koku.git
#      git clone https://github.com/project-koku/koku-ui.git
mkdir -p ~/code && cd ~/code
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git
cd koku-ui
```

**Ubuntu / Debian (and WSL 2 on Windows)**

> **WSL 2 users (Windows):** Do NOT use the `apt` Docker commands below. Docker Engine won't
> start in WSL 2 because systemd is not running by default.
> Instead, install **Docker Desktop for Windows**: <https://docs.docker.com/desktop/windows/install/>
> After installing: Docker Desktop → Settings → Resources → WSL Integration → enable your Ubuntu
> distro → Apply & Restart.
> Verify inside WSL 2: `docker info` (must work without sudo and without connection errors).
> Then skip item 1 below and continue from item 2.

```bash
# 1. Docker Engine + Compose plugin  (native Ubuntu/Debian only — WSL 2 users: see note above)
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo tee /etc/apt/keyrings/docker.asc > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo usermod -aG docker "$USER"

# ⚠ STOP — you MUST log out and log back in before continuing.
# The docker group change does not take effect in your current terminal session.
# Running `docker info` in this same terminal will fail with "permission denied".
#
# In WSL 2: close this terminal, reopen Windows Terminal, and relaunch Ubuntu.
# On native Linux: log out of your desktop session and log back in.
#
# After logging back in, re-open a terminal and continue with item 2 below.

# 2. Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Python 3.11 + build tools
sudo apt-get install -y python3.11 python3-pip make build-essential

# 4. pipenv + add it to PATH
pip3 install --user pipenv
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 5. Clone both repos as siblings
#    These commands use SSH (git@github.com:...). Verify your key works first:
#      ssh -T git@github.com   # should print "Hi <username>! You've successfully authenticated"
#    If you see "Permission denied (publickey)", set up an SSH key:
#      https://docs.github.com/en/authentication/connecting-to-github-with-ssh
#    Or clone with HTTPS instead (no SSH key needed):
#      git clone https://github.com/project-koku/koku.git
#      git clone https://github.com/project-koku/koku-ui.git
mkdir -p ~/code && cd ~/code
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git
cd koku-ui
```

**Fedora / RHEL / CentOS Stream**

```bash
# 1. Docker Engine + Compose plugin
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker "$USER"

# ⚠ STOP — you MUST log out and log back in before continuing.
# The docker group change does not take effect in your current terminal session.
# Running `docker info` in this same terminal will fail with "permission denied".
#
# Log out of your desktop session (or close/reopen the terminal), then re-open a
# terminal and continue with item 2 below.

# 2. Node.js 22+
sudo dnf module install -y nodejs:22

# 3. Python 3.11 + make
sudo dnf install -y python3.11 make

# 4. pipenv + add it to PATH
pip3 install --user pipenv
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 5. Clone both repos as siblings
#    These commands use SSH (git@github.com:...). Verify your key works first:
#      ssh -T git@github.com   # should print "Hi <username>! You've successfully authenticated"
#    If you see "Permission denied (publickey)", set up an SSH key:
#      https://docs.github.com/en/authentication/connecting-to-github-with-ssh
#    Or clone with HTTPS instead (no SSH key needed):
#      git clone https://github.com/project-koku/koku.git
#      git clone https://github.com/project-koku/koku-ui.git
mkdir -p ~/code && cd ~/code
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git
cd koku-ui
```

---

### Step 2 — Verify before running the script

Run these checks from the `koku-ui` directory. **All five must succeed** before you run the script. If any fails, go back to Step 1 for that tool.

```bash
docker info                  # must not say "Cannot connect to the Docker daemon"
node --version               # must print v22.x or higher
python3.11 --version         # must print Python 3.11.x exactly
pipenv --version 2>/dev/null || python3.11 -m pipenv --version  # must print a version number
ls ../koku/Pipfile           # must find the file (confirms koku repo is a sibling)
```

> **Note on pipenv:** if `pipenv --version` reports "command not found" but the second form works, that means `pipenv` was installed but its bin directory is not yet in your `PATH`. The setup script finds it automatically, so you can still proceed — but for convenience, add the directory to your shell's `PATH` as described in the Installation step above.

---

### Step 3 — Run the setup script

> **Important:** run this command from inside the `koku-ui` directory, not from `koku` or any other folder. The script checks for this and will exit with an error if you're in the wrong place.

```bash
cd ~/code/koku-ui      # adjust the path to wherever you cloned koku-ui
bash scripts/setup-dev-env.sh
```

The script asks **one question** before any long-running work begins:

> **Load sample AWS/Azure/GCP/OCP cost data? [y/N]**
>
> - Type **y** on your first run — cost report pages will show populated rows
> - Type **n** (or press Enter) for a faster setup — you can load data later

Then step away. You will see progress like this when it completes:

```
==> Checking prerequisites
  ✓ Docker 28.x
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
  ✓ Host port 9000 freed (MinIO console: http://localhost:9090)
==> Installing npm dependencies
  ✓ npm dependencies installed
  ✓ apps/koku-ui-onprem/.env created
==> Done
```

> **Why "Host port 9000 freed"?** The backend object-storage service (MinIO) binds `localhost:9000`
> by default — the same port the webpack dev server uses for your browser. The script automatically
> moves MinIO to an internal-only port after data loading completes, so both can run side-by-side.
> MinIO's web console remains at <http://localhost:9090>.
>
> If you ever need to do this manually (e.g. after a partial run with `--skip-backend`):
>
> ```bash
> cd ~/code/koku
> # Check what is on port 9000:
> docker ps --format "{{.Names}}\t{{.Ports}}" | grep 9000
> ```

---

### Step 4 — Start the frontend

```bash
npm run start:onprem
```

Open <http://localhost:9000>. No login required. The first webpack build takes ~60 seconds.

To verify everything is wired up end-to-end:

```bash
# Once npm run start:onprem has compiled, in another terminal:
curl http://localhost:9000/                                  # must return HTTP 200
curl http://localhost:9000/api/cost-management/v1/status/   # must return {"status":"OK"}
```

---

### Resuming work (Day 2+)

The setup script only needs to run once. On subsequent days:

**1. Start the backend** (if Docker Desktop was closed overnight):

```bash
# Docker Desktop must be running first (look for the green whale icon in the menu bar)
cd ~/code/koku
docker compose start
# Wait ~10 seconds, then verify:
curl http://localhost:8000/api/cost-management/v1/status/   # {"status":"OK"}
```

**2. Start the frontend** (every time you want to develop):

```bash
cd ~/code/koku-ui
npm run start:onprem
# Open http://localhost:9000
```

No need to re-run `bash scripts/setup-dev-env.sh` unless:

- You deleted Docker volumes (`make docker-down` or `docker compose down -v`)
- You cloned a fresh copy on a new machine
- You need to reset the database and re-seed sample data

---

### What the script does (and does not do)

| Automated by the script | Must be done manually (Step 1) |
|------------------------|-------------------------------|
| `pipenv install --dev` — Python packages | Install Docker Desktop |
| `pre-commit install` — git hooks | Install Node.js |
| Pull Docker images (~1–2 GB, first time) | Install Python 3.11 |
| Start all backend containers | Install pipenv |
| Fix Trino empty-credential crash on startup | Clone the koku backend repo |
| Wait up to 3 min for DB migrations to finish | Add your SSH key to GitHub |
| Create a test customer account | |
| Optionally load sample AWS/Azure/GCP/OCP data | |
| Free host port 9000 from MinIO (port conflict fix) | |
| Create `apps/koku-ui-onprem/.env` for the API proxy | |
| Warn if `/etc/hosts` is missing stage proxy entries | |

> **Safe to re-run:** already-running containers are not restarted, installed packages are skipped, and the `.env` file is never overwritten.

---

### Script flags

```bash
bash scripts/setup-dev-env.sh --skip-backend   # frontend only — backend containers already running
bash scripts/setup-dev-env.sh --skip-frontend  # backend only — skip npm install, .env creation, and hosts check
bash scripts/setup-dev-env.sh --load-data      # always load sample data, no prompt
bash scripts/setup-dev-env.sh --skip-data      # skip sample data, no prompt (for CI)
bash scripts/setup-dev-env.sh --help           # print usage
```

**When to use `--skip-backend`:** If the script completed backend setup but stopped before npm install (e.g. network timeout), re-run with `--skip-backend` to pick up from the frontend step without re-pulling Docker images.

**When to use `--skip-frontend`:** If you only changed the koku backend and want to restart the Docker stack without touching npm.

---

> **If something goes wrong during setup**, see the [Troubleshooting](#troubleshooting) section at the bottom of this file. Most problems are: Docker not running, wrong Python version, pipenv not in PATH, or koku repo not found at `../koku`.

---

## Repo Architecture — What Are koku-ui-hccm, koku-ui-onprem, and koku-ui-ros?

This is a **monorepo** — one Git repository containing three separate frontend applications and two shared libraries, each deployed independently.

```
koku-ui/
├── apps/
│   ├── koku-ui-hccm/       ← All cost-management pages (OpenShift, AWS, GCP, Azure, Settings…)
│   ├── koku-ui-onprem/     ← Webpack dev server + API proxy (no page components)
│   └── koku-ui-ros/        ← Optimizations page only
└── libs/
    ├── ui-lib/             ← Shared React components used by all three apps
    └── onprem-cloud-deps/  ← Shared PatternFly singletons for Module Federation
```

### koku-ui-hccm — The Main Application

HCCM = Hybrid Cloud Cost Management. Every cost page you see in the running UI is a component from this app:

| Sidebar label | Page |
|--------------|------|
| Overview | Cost overview landing page |
| OpenShift | OCP cost breakdown |
| Amazon Web Services | AWS cost breakdown |
| Google Cloud | GCP cost breakdown |
| Microsoft Azure | Azure cost breakdown |
| Cost Explorer | Cost Explorer |
| Settings | All settings tabs |

**Production:** served on `console.redhat.com` for SaaS customers.

**Local dev:** `npm run start:onprem` builds this app and serves it via the on-prem shell — you never run it standalone.

**If you are adding a feature** (new group-by option, filter category, API field), your changes will be inside `apps/koku-ui-hccm/src/`.

### koku-ui-onprem — The Dev Server Shell

This app has **no page-level React components**. Its three jobs:

1. Run the webpack dev server on `localhost:9000` — **this port is fixed and must not be changed**. The backend MinIO container also binds 9000 by default; the setup script resolves that conflict automatically.
2. Proxy every `/api/cost-management/v1/…` request from the browser to the koku backend at `localhost:8000`. The proxy target is read from `apps/koku-ui-onprem/.env`
3. Load (federate) page components from `koku-ui-hccm` and `koku-ui-ros` at runtime via webpack Module Federation

**Why it exists:** On-premises OCP installations ship the UI as a self-contained container image. The on-prem shell packages all three apps into that image. Locally it is your dev server.

**The only file you touch in this app:**

```
apps/koku-ui-onprem/.env    ← gitignored, created automatically by the setup script
```

```ini
API_PROXY_URL=http://localhost:8000/api/cost-management/v1
API_TOKEN=
```

Any change to this file requires restarting `npm run start:onprem`.

### koku-ui-ros — Resource Optimization Service

Contains only the **Optimizations** page. It uses a different backend service and is owned by a different team with a different release schedule. It builds alongside hccm and is served by the on-prem shell. Unless you are working on the Optimizations feature, you will never touch this app.

### How the Three Apps Work Together Locally

```
npm run start:onprem
│
├── koku-ui-onprem  →  localhost:9000 (shell + proxy + Module Federation host)
│        │
│        ├── Proxy: /api/cost-management/v1/* → localhost:8000 (koku backend)
│        ├── Federates koku-ui-hccm pages (OpenShift, AWS, Settings, …)
│        └── Federates koku-ui-ros pages  (Optimizations)
│
├── koku-ui-hccm  →  apps/koku-ui-hccm/dist/
└── koku-ui-ros   →  apps/koku-ui-ros/dist/
```

**Example request flow:** you click **OpenShift** in the sidebar → hccm component loads → it calls `GET /api/cost-management/v1/reports/openshift/costs/` → the on-prem proxy rewrites that to `http://localhost:8000/api/cost-management/v1/reports/openshift/costs/` → koku backend returns the data → the component renders the cost table.

---

## Manual Setup (Step by Step)

The sections below cover the same setup **without the script**. Use this if:

- The script failed partway and you need to understand what each step does
- You want a minimal environment (e.g. skip Trino)
- You are debugging a specific setup issue

## 1. Clone the Repositories

```
git clone git@github.com:project-koku/koku.git
git clone git@github.com:project-koku/koku-ui.git
```

Both repos should be siblings in the same parent directory. The rest of this guide refers to them as `[KOKU]` and `[KOKU_UI]`.

## 2. Set Up the Backend (Koku API)

### 2.1 Install Python dependencies

```
cd [KOKU]
pipenv install --dev
pipenv shell
```

All `make` commands below must be run inside this pipenv shell. Also install the pre-commit hooks:

```
pre-commit install
```

### 2.2 Start the backend services

Koku uses Docker Compose. Two profiles:

| Command | What starts | When to use |
|---------|-------------|-------------|
| `make docker-up-min` | PostgreSQL, Redis, koku-server, koku-worker | Quick start, no Trino |
| `make docker-up-min-trino` | Above + Trino, MinIO, Hive metastore | Needed for cost report data |

For most work use the Trino profile:

```
make docker-up-min-trino
```

> **First run:** Docker pulls ~1-2 GB of images. This takes a few minutes once; subsequent starts are fast.

Check that the containers are up:

```
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

### 2.3 Create a test customer and load data

```
python3 dev/scripts/create_test_customer.py --api-prefix /api/cost-management
make load-test-customer-data
```

The `--api-prefix` flag is required because koku's `.env` sets `API_PATH_PREFIX=/api/cost-management`. Without it the script targets the wrong URL and gets 404s.

`load-test-customer-data` populates the Trino pipeline with sample cost rows for AWS, Azure, GCP, and OCP. The worker processes it in the background — wait a minute before expecting reports to show data.

### Verify the backend is working

The identity header below is a base64-encoded JSON blob matching the test customer in `dev/scripts/test_customer.yaml` (`account_id: 10001`, `org_id: 1234567`, `user: test_customer`):

```
curl -s http://localhost:8000/api/cost-management/v1/reports/openshift/costs/ \
  -H 'x-rh-identity: eyJpZGVudGl0eSI6IHsiYWNjb3VudF9udW1iZXIiOiAiMTAwMDEiLCAib3JnX2lkIjogIjEyMzQ1NjciLCAidHlwZSI6ICJVc2VyIiwgInVzZXIiOiB7InVzZXJuYW1lIjogInRlc3RfY3VzdG9tZXIiLCAiZW1haWwiOiAidGVzdEBleGFtcGxlLmNvbSIsICJpc19vcmdfYWRtaW4iOiB0cnVlfX0sICJlbnRpdGxlbWVudHMiOiB7ImNvc3RfbWFuYWdlbWVudCI6IHsiaXNfZW50aXRsZWQiOiAiVHJ1ZSJ9fX0=' \
  | python3 -m json.tool | head -30
```

You should see a JSON response with `data`, `links`, and `meta` keys. An empty `data: []` just means the worker hasn't finished yet — wait a minute and retry.

### Service URLs (backend)

| Service | URL |
|---------|-----|
| Koku API | <http://localhost:8000> |
| MASU (ingestion) | <http://localhost:5042> |
| PostgreSQL | localhost:15432 (user: `koku`, db: `koku`) |

## 3. Set Up the Frontend (Koku UI)

### 3.1 Add hosts entries (one time)

Needed for Option A (stage proxy). Edit the system hosts file and add:

```
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
```

- **macOS / Linux / WSL 2:** edit `/etc/hosts` (use `sudo`)
- **Windows (native):** edit `C:\Windows\System32\drivers\etc\hosts` (open Notepad as Administrator)

Or run the npm helper (macOS / Linux / WSL 2):

```
cd [KOKU_UI]
npm run -w @koku-ui/koku-ui-hccm patch:hosts
```

### 3.2 Install dependencies

```
cd [KOKU_UI]
npm install
```

### 3.3 Choose a run mode

There are three ways to run the frontend, depending on what backend you want to point at.

#### Option A — Against the Red Hat stage environment (no local backend needed)

```
npm run start:hccm
```

When prompted, select `stage`. Open <https://stage.foo.redhat.com:1337/openshift/cost-management> and log in with a Red Hat account that has Cost Management permissions.

#### Option B — Against a local Koku API (on-prem shell)

This proxies API calls from `localhost:9000` to your local backend. No login required.

**Step 1.** Create the proxy config (gitignored):

```
cat > apps/koku-ui-onprem/.env <<EOF
API_PROXY_URL=http://localhost:8000/api/cost-management/v1
API_TOKEN=
EOF
```

**Step 2.** Start the dev server:

```
npm run start:onprem
```

**Step 3.** Open <http://localhost:9000>

#### Option C — Against a local Koku API (fec proxy)

```
npm run -w @koku-ui/koku-ui-hccm start:local:api
```

Open <http://localhost:1337/openshift/cost-management>. Keycloak on port 4020 handles auth (provided by the Docker Compose stack).

### Verify the frontend is working

Open a cost page (e.g. OpenShift). Data should load. In DevTools → Network, API calls to `/api/cost-management/v1/` should return HTTP 200.

## 4. Watching Logs

```
cd [KOKU]
docker compose logs -f koku-server koku-worker
```

## 5. Stopping and Cleaning Up

```
cd [KOKU]
make docker-down          # stops containers and removes volumes
docker system prune --all # optional: reclaim disk space
```

`make docker-down` runs `docker compose down -v --remove-orphans` — this removes containers, networks, and volumes (including the database). You'll need to re-run the test data steps after this.

## Troubleshooting

### Reports show no data

The koku-worker processes ingested data asynchronously. After running `make load-test-customer-data`, give it a minute or two. Check progress with `docker compose logs -f koku-worker`.

### `localhost:9000` shows a blank page

`apps/koku-ui-onprem/.env` is probably missing. Create it:

```
echo 'API_PROXY_URL=http://localhost:8000/api/cost-management/v1' > apps/koku-ui-onprem/.env
```

Then restart `npm run start:onprem`.

### Browser shows 504 on API calls ("This page is temporarily unavailable")

The frontend (`localhost:9000`) proxies every `/api/cost-management/v1/*` request to the koku-server at `localhost:8000`. If the backend containers are stopped, every request times out with 504.

This usually happens after Docker Desktop quits. Containers stop but are not deleted, so no data is lost. Fix:

```
cd [KOKU]
docker compose start
```

Verify it's back:

```
curl http://localhost:8000/api/cost-management/v1/status/
# {"status":"OK"}
```

Then reload the browser. No need to restart the frontend.

### Port 8000 already in use

```
# macOS / Linux with lsof:
lsof -i :8000

# Linux alternative (if lsof is not installed):
ss -tlnp | grep ':8000'
```

If it's a leftover koku container, run `make docker-down` then start again.

### Trino exits immediately after `make docker-up-min-trino`

Trino's Glue catalog connector requires non-empty AWS credentials. If your shell or `koku/.env` has `AWS_ACCESS_KEY_ID=` (blank), Docker Compose passes it into the container and Trino crashes with:

```
NullPointerException: Access key ID cannot be blank
```

koku uses a local hive/thrift metastore, not AWS Glue, so the value just needs to be non-empty. Restart Trino with a dummy placeholder:

```
cd [KOKU]
AWS_ACCESS_KEY_ID=local-dev AWS_SECRET_ACCESS_KEY=local-dev \
  docker compose up -d --force-recreate trino
```

The setup script handles this automatically.

### Stage login fails or returns 403

Your Red Hat account needs the `Cost Management` role in the stage environment. Ask your org admin or create a test account at <https://access.stage.redhat.com>.

### <a name="podman-apple-silicon"></a>Podman on Apple silicon

If you see `The server port 9998 is already in use` with fec dev:

```
podman machine stop
podman machine rm
podman machine init --image docker://quay.io/podman/machine-os:5.5
podman machine start
```

See the [Slack thread](https://redhat-internal.slack.com/archives/C023VGW21NU/p1758114060634089) for context (Red Hat internal — not accessible outside the org).

### Clearing the API cache

Koku caches responses in Valkey. If you've changed DB rows manually and want fresh responses:

```
docker compose exec valkey valkey-cli flushall
```

### `npm run start:onprem` exits immediately or says "address already in use"

Something is already on port 9000. Find and stop it:

```bash
# macOS / Linux — find and kill whatever is on port 9000:
lsof -ti :9000 | xargs kill -9 2>/dev/null && echo "cleared"
# Or check what it is first:
lsof -i :9000
```

If it's `koku-minio`, the MinIO port-rebind step did not complete. Run this manually:

```bash
cd ~/code/koku
# Confirm MinIO is still bound to host port 9000:
docker ps --format "{{.Names}}\t{{.Ports}}" | grep minio
# If it shows 0.0.0.0:9000, rebind it:
cat > /tmp/minio-fix.yml << 'EOF'
services:
  minio:
    ports: !reset
      - "9090:9090"
EOF
docker compose -f docker-compose.yml -f /tmp/minio-fix.yml up -d --no-deps --force-recreate minio
rm /tmp/minio-fix.yml
# Then retry:
cd ~/code/koku-ui && npm run start:onprem
```

[Jira]: https://issues.redhat.com/projects/COST/
