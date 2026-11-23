---
name: update-ui-dependencies
description: >
  Update minor npm dependencies for koku-ui on a clean dependencies branch, then
  lint, test, build:onprem, smoke-start HCCM/ROS, and open a GitHub PR as
  koku-ui-bot when the user confirms. Use when the user asks to update
  dependencies, bump packages, run check:dependencies, skip-held dependency
  updates, or refresh npm deps in this Cost Management monorepo.
---

# Update UI dependencies (koku-ui)

When the user says **update dependencies** (or similar) in this workspace, run this workflow on **koku-ui** — no need for them to name the repo. Do not update hybrid-committed-spend-ui in the same invocation.

## Checklist

Copy and track:

```
Dependency update:
- [ ] 0. Clean dependencies branch (or warn + exit)
- [ ] 1. Preview outdated (skip-held)
- [ ] 2. Apply minor updates + npm install
- [ ] 3. Handle pinned packages
- [ ] 4. Lint (clean)
- [ ] 5. Test (clean — no errors or warnings)
- [ ] 6. Build (build:onprem)
- [ ] 7. Ensure podman running
- [ ] 8. Start HCCM (non-interactive) + manual smoke
- [ ] 9. Start ROS (non-interactive) + manual smoke
- [ ] 10. Ask user; if yes — commit, push, open PR as koku-ui-bot; restore gh user
- [ ] 11. Summary
```

## Step 0: Clean `dependencies` branch

Do this **before** any dependency edits. Base branch is `upstream/main` (fallback: `origin/main` if `upstream` is missing).

1. Record the current branch name and the active GitHub CLI user (`gh auth status` — the account with `Active account: true`).
2. If the working tree is dirty (`git status --porcelain` non-empty):
   - **Warn the user** that the worktree has uncommitted changes.
   - **Exit the skill** — do not stash, reset, or continue.
3. `git fetch` remotes that exist (`upstream`, `origin`).
4. Inspect local and remote `dependencies` (e.g. `dependencies`, `origin/dependencies`, `upstream/dependencies`):
   - If any such ref **exists and contains changes** relative to the base tip — meaning it points at a different commit than base, or `git log base..dependencies` is non-empty — **warn the user** (name which refs and that they have changes) and **exit**. Do not delete or overwrite those refs.
   - “Contains changes” includes prior dependency commits, unrelated commits, or any divergence from base. Only a missing branch, or a branch that already equals the base tip, is OK.
5. Create or reset a **clean** local branch from base:

```bash
git checkout -B dependencies upstream/main
```

(Use `origin/main` if there is no `upstream`.)

## Step 1: Preview

On a clean checkout, `ncu` is only available via `node_modules/.bin`, so install locked deps first:

```bash
npm ci
npm run check:dependencies:minor:skip-held
```

Record what would change. If nothing is outdated, stop and say so in the summary (no PR).

## Step 2: Apply updates

```bash
npm run check:dependencies:update:minor:skip-held
```

**Sync `overrides` before install.** `ncu` may bump a direct dependency (e.g. `eslint`) while leaving `package.json` `overrides` unchanged, which causes `EOVERRIDE` on `npm install`. After ncu and before install, for every key in `overrides` that is also a direct dependency/devDependency, set the override to the same version string as the direct dependency (or use npm’s dependency-reference form, e.g. `"eslint": "$eslint"`). At minimum keep `overrides.eslint` aligned with the root `eslint` entry.

Then:

```bash
npm install
```

`skip-held` already rejects `@patternfly/*`, `@redhat-cloud-services/frontend-components*`, and `victory`. Do not force those via this workflow unless the user asks.

## Step 3: Pinned packages

Inspect root and workspace `package.json` files after the ncu update.

**Always keep pinned (exact version, no `^`):**
- All `@patternfly/*` packages — leave exact versions (e.g. `"6.6.2"`, not `"^6.6.2"`).

**Temporarily pinned packages** (exact version because a prior update failed), e.g. `jest-mock-axios`:
- Prefer restoring a caret range when retrying the update.
- Example: change `"jest-mock-axios": "4.9.1"` → `"jest-mock-axios": "^4.10.1"` (new minor + caret), then `npm install`.
- If install, lint, test, build, or start fails because of that package, pin it again to a known-good exact version and note it in the summary.

For most other packages that already use `^`, leave the caret as ncu wrote it.

## Step 4: Lint

```bash
npm run lint
```

Requirements: **no errors and no warnings** in the output.

If lint fails:
1. `npm run lint:fix`
2. Re-run `npm run lint`.
3. If still failing, fix the remaining issues in code yourself and re-run until clean.

## Step 5: Test

```bash
npm run test
```

Requirements: **clean output** — exit 0 and **no errors or warnings** in the output. Passing tests with leftover warnings is not done.

If anything fails or warns:
1. Diagnose from the output.
2. Fix code, mocks, snapshots, or deps as needed.
3. Re-run `npm run test` until the output is clean.
4. Note each fix in the summary.

Do not claim tests are fixed without re-reading the latest full test output for warnings.

## Step 6: Build

```bash
npm run build:onprem
```

This builds all UIs in the monorepo. If it fails, fix and re-run. Pin a dependency only when the upgraded package is the clear cause; note the pin in the summary.

## Step 7: Ensure podman is running

`fec dev` needs podman (chrome container). Before any start:

```bash
podman machine start
```

If the machine is already running, that command typically succeeds or reports it is already up — continue. If it fails, fix podman and do not proceed to start until it works.

## Step 8–9: Start + smoke check (HCCM, then ROS)

Do **not** use bare `npm run start:hccm` / `npm run start:ros` — those invoke `fec dev` interactively and fail in non-interactive agent shells (`ERR_USE_AFTER_CLOSE` on the platform-environment prompt).

Pass `--clouddotEnv=stage` through the workspace `start` script (not via `npm run start:hccm -- …`, which does not forward args correctly):

```bash
# HCCM
npm run start -w @koku-ui/koku-ui-hccm -- --clouddotEnv=stage

# ROS (after stopping HCCM — they share the chrome container / ports)
npm run start -w @koku-ui/koku-ui-ros -- --clouddotEnv=stage
```

Equivalent from each app directory: `npx fec dev --clouddotEnv=stage`.

**Run sequentially** (not in parallel): HCCM and ROS both use the insights-chrome podman container (port 9998) and default webpack port, so only one `fec dev` at a time.

For each app:
1. Start with `--clouddotEnv=stage`.
2. Wait until webpack compiles successfully. Treat compile/start failures as high priority — updates to `@redhat-cloud-services/frontend-components-config` (and related `@redhat-cloud-services` packages) have broken webpack start before; pin or revert the offending package if needed and note it.
3. After a successful start, stop and wait for the user to confirm or skip **this app only**. Do **not** require ROS results before ROS has started. Include a clickable markdown link for the app that is currently running:

- HCCM: https://stage.foo.redhat.com:1337/openshift/cost-management
- ROS: https://stage.foo.redhat.com:1337/staging/cost-management/ros

   **End that message with this exact last line (bold, nothing after it):**

   **Please open a couple of pages in the running UI and reply when done (or say skip).**
4. After the user replies for the current app, stop that server before starting the other (unless they want to keep it).
5. Before Step 10, ensure smoke outcomes for **both** HCCM and ROS are confirmed or explicitly skipped.

**Re-verify after late pins.** If you change any dependency after Step 4 (including a pin/revert during start), re-run the affected checks from that point forward: lint, test, build, and smoke for both apps as needed. The summary and PR test plan must reflect only the **final** dependency set.

## Step 10: Ask, then optionally commit / push / PR (`koku-ui-bot`)

After both smoke checks are confirmed or skipped:

1. Stop any running `fec` / chrome container left from smoke.
2. Present the dependency summary (including any pins/fixes and whether smoke was OK or skipped).
3. **Ask the user whether to create the PR** — do not commit, push, or open a PR until they explicitly answer **Y**. Treat **N** / no as stop after the summary (leave the `dependencies` branch and local changes as-is unless they ask to discard).

   **End that message with this exact last line (bold, nothing after it):**

   **Do you want me to create the PR as koku-ui-bot? (Y/N)**
4. If they answer **Y** and there are no dependency-related changes to commit, skip the PR and say so.
5. If they answer **Y**: commit only dependency update artifacts and fixes from this run (e.g. `package.json`, lockfile, code fixes). Do **not** include unrelated files. Follow the repo commit-message style; focus on why.
6. Push and open the PR **as `koku-ui-bot`**, then restore the previous GitHub CLI user:

```bash
PREV_GH_USER="<active user recorded in Step 0>"
gh auth switch --user koku-ui-bot

# Push to upstream (same-repo PR). Do NOT use origin/fork head — koku-ui-bot
# cannot open a PR from another user's fork ("Fork collab ... without permission").
git push -u upstream dependencies

gh pr create --repo project-koku/koku-ui --base main --head dependencies --title "<title>" --body "$(cat <<'EOF'
## Summary
<bullets from the dependency summary>

## Test plan
- [x] lint
- [x] test (clean)
- [x] build:onprem
- [x] start HCCM / ROS smoke (or skipped by user)
EOF
)"

gh auth switch --user "$PREV_GH_USER"
```

Always switch back to `$PREV_GH_USER` even if push or `gh pr create` fails (use a `trap` or an explicit final switch). Return the PR URL in the summary.

## Failure and pinning policy

At every step: attempt to fix the issue before giving up.

Pinning is allowed when an upgraded package breaks install, lint, test, build, or start. Prefer the previous known-good exact version. Always record:
- package name
- attempted version
- pinned version
- which step failed

If the pin happens after Step 4, re-run lint/test/build/smoke as needed so verification matches the pinned set.

## Summary (required)

End with a summary like:

```markdown
## Dependency update summary — koku-ui

### Updated
- `package`: old → new
- …

### Still held / skipped by skip-held
- `@patternfly/*`, `@redhat-cloud-services/frontend-components*`, `victory` (unchanged by design)

### Pins kept or restored
- `jest-mock-axios`: kept/restored at `4.9.1` because <reason>
- …

### Carets restored
- `jest-mock-axios`: `4.9.1` → `^4.10.1`

### Fixes applied
- Lint: …
- Test: …
- Build: …
- Start: …

### Verification
- [ ] lint clean
- [ ] test clean (no warnings)
- [ ] build:onprem passed
- [ ] podman machine running
- [ ] start HCCM (`--clouddotEnv=stage`) / webpack OK
- [ ] start ROS (`--clouddotEnv=stage`) / webpack OK
- [ ] manual UI smoke — HCCM (user)
- [ ] manual UI smoke — ROS (user)
- [ ] user approved PR creation
- [ ] PR opened as koku-ui-bot
- [ ] gh user restored

### PR
- <url>

### Blockers / follow-ups
- …
```

If a step could not be fixed, say what failed, what was tried, and what remains.
