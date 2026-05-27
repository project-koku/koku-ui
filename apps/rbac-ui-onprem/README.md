# rbac-ui-onprem

On-prem federated remote for **insights-rbac-ui** (scope `insightsRbac`, `/rbac/`, `./Iam`). No upstream repo edits — webpack shims live under `src/shims/`.

## Vendored upstream (Konflux / hermetic CI)

Upstream sources are a **git submodule** at the koku-ui repo root (not fetched at image build):

```text
vendor/insights-rbac-ui/                         # git submodule @ pinned commit
apps/rbac-ui-onprem/package.json                 # devDependency: file:../../vendor/insights-rbac-ui
```

Konflux and local `npm ci` install `insights-rbac-frontend` from the submodule directory; webpack produces `apps/rbac-ui-onprem/dist/` during `build:onprem` (same as other on-prem MFEs).

Clone koku-ui with submodules:

```bash
git clone --recurse-submodules https://github.com/project-koku/koku-ui.git
# or after clone:
git submodule update --init vendor/insights-rbac-ui
```

### Bump upstream ref

Pin in git (`.gitmodules` path/URL + submodule gitlink), then refresh npm if the lockfile needs it:

```bash
cd vendor/insights-rbac-ui
git fetch origin && git checkout <full-sha>
cd ../..
git add vendor/insights-rbac-ui
git submodule update --init vendor/insights-rbac-ui
HUSKY=0 npm install -w @koku-ui/rbac-ui-onprem
git add package-lock.json   # if changed
```

## Scripts

| Entry | Purpose |
|-------|---------|
| `package.json` `build:onprem`, `start:onprem` | Production / dev webpack (same pattern as HCCM/ROS) |

## Verification

```bash
git submodule update --init vendor/insights-rbac-ui
npm ci
npm run build:onprem -w @koku-ui/rbac-ui-onprem
test -f apps/rbac-ui-onprem/dist/plugin-manifest.json
```

## Local dev

From koku-ui root: `npm run start:onprem:dev` runs RBAC webpack watch with the host and other remotes.

See [wiki/topics/rbac-ui-onprem-vendor.md](../../../../wiki/topics/rbac-ui-onprem-vendor.md) in the workspace for Konflux notes.
