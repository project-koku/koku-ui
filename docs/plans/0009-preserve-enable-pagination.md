---
date: 2026-11-24
spec: ../specs/0009-preserve-enable-pagination.md
decisions:
  - ../decisions/0009-001-reset-enable-when-show-disabled-off.md
---

# Preserve page on currency enable/disable (COST-8631)

## Context

[COST-8631](https://redhat.atlassian.net/browse/COST-8631): on Settings → Exchange rates, toggling Enabled on a paginated row jumps back to page 1. Repro uses “Show disabled” on, so the currency stays in the list; only `enabled` changes.

This was left intentional in [COST-8568](https://redhat.atlassian.net/browse/COST-8568) / [`docs/plans/0004-preserve-expand-pagination.md`](0004-preserve-expand-pagination.md): enable/disable always called `handleOnSetPage(1)` because disabling can remove a row when “Show disabled” is off. With show-disabled on (`filter.enabled` omitted), list membership does not change, so a blanket reset is wrong for that workflow.

## Root cause

In [`exchangeRate.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.tsx), `handleOnEnable` always reset to page 1 before `forceUpdate()`.

## Fix

1. In `handleOnEnable`: call `handleOnSetPage(1)` only when `!isShowDisabled`; always `forceUpdate()`.
2. Leave `handleOnShowDeprecated` resetting to page 1 — that toggles the API filter and rebuilds the list.
3. Tests in [`exchangeRate.test.tsx`](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRate.test.tsx):
   - Keep page after add/delete/duplicate
   - Keep page after enable when show disabled is on
   - Reset to page 1 after enable when show disabled is off

## Docs (effort `0009`)

- Plan, spec, and decision as linked in frontmatter

## Out of scope

- Clamping page when the current page becomes empty after disable with show-disabled off (reset to page 1 instead)
- Changing show-disabled toggle pagination behavior
