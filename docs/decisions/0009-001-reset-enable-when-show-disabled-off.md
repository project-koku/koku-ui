---
status: accepted
date: 2026-11-24
---

# Reset pagination on enable only when show disabled is off

## Context and Problem Statement

Should enable/disable of a currency always keep the current exchange-rates page, or reset when the currency can leave the filtered list?

Related plan: [`../plans/0009-preserve-enable-pagination.md`](../plans/0009-preserve-enable-pagination.md).

## Considered Options

- Always keep the current page on enable/disable
- Reset to page 1 only when “Show disabled” is off

## Decision Outcome

Chosen: reset to page 1 only when “Show disabled” is off.

With show-disabled on, both enabled and disabled currencies remain in the result set, so the page is still valid. With show-disabled off, disabling removes the currency from the enabled-only list and prior offsets are no longer reliable.

### Consequences

- COST-8631 repro (show disabled on) no longer jumps to page 1
- Enabled-only view still resets after a toggle that can change list membership
