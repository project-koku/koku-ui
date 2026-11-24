---
date: 2026-11-24
plan: ../plans/0009-preserve-enable-pagination.md
---

# Preserve page on currency enable/disable

## Context

Settings → Exchange rates resets to page 1 after toggling a currency’s Enabled switch ([COST-8631](https://redhat.atlassian.net/browse/COST-8631)). The reported path uses “Show disabled”, so the row stays in the paginated result set. When “Show disabled” is off, the list is enabled-only: disabling a currency removes it and the prior page offsets are no longer valid.

## Requirements

- After enable or disable with “Show disabled” on, stay on the current exchange-rates page.
- After enable or disable with “Show disabled” off, reset to page 1.
- The “Show disabled” toolbar toggle may still reset to page 1 (API filter changes which currencies appear).

## Considered options

- Always keep the page on enable/disable. Rejected: with show-disabled off, disabling shrinks the enabled-only result set and page offsets become invalid.
- Reset only when show-disabled is off. Chosen: preserves the COST-8631 workflow and still corrects pagination when the currency leaves the list.

## Outcome

Enable/disable keeps the current page when both enabled and disabled currencies are shown; otherwise it resets to page 1. Show-disabled still jumps to page 1.
