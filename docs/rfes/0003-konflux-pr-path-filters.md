# RFE-0003: Path-filter Konflux PR builds per app

## Problem

Every PR runs Konflux for all three apps (`koku-ui-hccm`, `koku-ui-ros`, `koku-ui-onprem`), including enterprise-contract checks. Builds are often queued rather than parallel, so PRs that touch only one SaaS app still wait on the others.

## Goal

Run Konflux **pull_request** builds for `koku-ui-hccm` and `koku-ui-ros` only when those apps (or shared inputs) changed. Keep **push-to-main** building every app so stage `ref: main` and `release:all` stay valid. Always build **onprem** on every PR (it bundles hccm and ros). Avoid Quay-based SHA changes and tagging changes.

Skipped builds must not leave required GitHub checks pending.

## Proposed direction

- Extend `on-cel-expression` on the HCCM and ROS PR PipelineRuns with `.pathChanged()` for app paths plus shared roots (`libs/***`, lockfile, `build-tools/***`, etc.). Do not use `on-path-changed` while CEL is present (PAC ignores it).
- Leave onprem PR and all push PipelineRuns unfiltered.
- Prefer Pipelines-as-Code Repository CR `status_checks` with `unmatched_conclusion: success` so skipped on-PR checks still pass under branch protection.
- Treat a custom `konflux-pr-gate.yml` plus swapping away the six required Konflux checks as a last resort — likely too much complexity for skipping at most one SaaS build per PR.
- Enterprise Contract checks may still hang when a build is skipped; that needs a Konflux/PAC answer before enabling path filters under current required checks.

## Open questions

- Does cost-mgmt-dev-tenant PAC support Repository CR `status_checks` / `unmatched_conclusion: success`?
- How should required enterprise-contract checks behave when the component build did not run?
