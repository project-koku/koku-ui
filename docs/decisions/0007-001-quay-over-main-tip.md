---
status: accepted
date: 2026-11-04
---

# Prefer Quay latest over tip of main for release SHA

## Context and Problem Statement

`release-app-interface.sh` must choose a git SHA to pin in app-interface prod. Tip of `main` can move before Konflux promotes an image, so a release can reference a commit with no deploy tag yet. Related plan: [`../plans/0007-quay-release-sha.md`](../plans/0007-quay-release-sha.md).

## Considered Options

- Always use tip of `origin/main`.
- Always use Quay `latest` OCI revision; abort if labels are missing.
- Prefer Quay `latest` OCI revision; prompt before falling back to tip of `main`.

## Decision Outcome

Chosen: prefer Quay `latest` OCI revision, with an interactive tip-of-main fallback (default abort).

Silent tip-of-main (with or without Quay failure fallback) recreates the missing-image race. Prompted fallback keeps an escape hatch when Quay metadata is temporarily unreadable without making that path the default.

### Consequences

- Staggered HCCM and ROS releases can pin different SHAs; each Quay-resolved SHA is backed by that app's Quay `latest`. A tip-of-main chosen via fallback may not have an image yet.
- Operators must answer a prompt if Quay lookup fails; non-interactive Enter aborts.
