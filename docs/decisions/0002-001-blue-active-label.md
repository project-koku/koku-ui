---
status: accepted
date: 2026-10-30
---

# Use a blue outline for the active exchange rate

## Context and Problem Statement

The exchange rate status column labels Active, Upcoming, and Expired. QE suggested a green Active label and a red Expired label. PatternFly reserves those colors for success and danger. A later change could reapply them and make a normal list of expired rates look like a failure.

## Considered Options

- Green for Active and red for Expired
- Leave every status on the default outline label
- Nonstatus blue for Active only, using `LabelColor.blue` and no status icon

## Decision Outcome

Chosen option: **nonstatus blue for Active only**. `color={LabelColor.blue}` with `variant="outline"`. Upcoming and Expired stay the default outline label. The label `status` prop stays unset, because `status="info"` would add an info icon and present the phase as a severity.

Related plan: [0002-active-rate-label.md](../plans/0002-active-rate-label.md).

### Consequences

- Good, because the current rate is easier to scan, and expired rows stay quiet.
- Bad, because blue is also the color of links and informational status. The label is not clickable and has no icon, which keeps it distinct from those uses.
