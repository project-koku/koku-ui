---
date: 2026-11-04
plan: ../plans/0007-quay-release-sha.md
---

# Quay-backed release SHA selection

## Context

Prod releases for `koku-ui-hccm` and `koku-ui-ros` pin app-interface namespace `ref` values via `scripts/release/release-app-interface.sh`. That script previously used tip of `origin/main`. Konflux builds and promotes images asynchronously, and deploy Quay tags are short SHAs (plus movable `latest`), so tip-of-main can race ahead of a deployable image—especially when releasing the two apps in separate runs.

## Requirements

- Prod (and manual stage pin) SHAs must come from an image that already exists on the deploy Quay registry when possible.
- App-interface continues to store an immutable full git commit as `ref`, never the mutable `latest` tag.
- Each app resolves its own Quay `latest` independently.
- Quay JSON is parsed with `jq` (required), matching other repo shell tooling.
- If Quay OCI labels cannot supply a SHA, ask before falling back to tip of `main`; default abort.
- If Quay lags tip of `main` or matches current app-interface prod, warn and ask continue / wait / abort (default abort). Wait polls up to 20 minutes.
- Document the behavior in each app's `RELEASE.md`.

## Considered options

1. Keep tip of `main` with no image check.
2. Resolve SHA from Quay `latest` OCI labels; fail closed if unavailable.
3. Resolve SHA from Quay `latest` OCI labels; prompt for tip-of-main fallback if unavailable; warn/wait when behind main or unchanged vs app-interface prod.

## Outcome

Use option 3. Destination: [`scripts/release/release-app-interface.sh`](../../scripts/release/release-app-interface.sh), [`scripts/release/release-all.js`](../../scripts/release/release-all.js), [`apps/koku-ui-hccm/RELEASE.md`](../../apps/koku-ui-hccm/RELEASE.md), [`apps/koku-ui-ros/RELEASE.md`](../../apps/koku-ui-ros/RELEASE.md).
