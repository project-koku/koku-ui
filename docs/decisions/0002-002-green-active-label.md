---
status: accepted
date: 2026-11-02
supersedes: 0002-001-blue-active-label.md
---

# Use a green outline for the active exchange rate

## Context and Problem Statement

[0002-001-blue-active-label.md](0002-001-blue-active-label.md) chose a nonstatus blue Active label and rejected green Active with red Expired. UX later asked for light green on Active. PatternFly's nonstatus green (`LabelColor.green`) is the outline palette color, not the success status that adds a checkmark icon. Red for Expired remains a danger association and should stay unused.

## Considered Options

- Keep nonstatus blue for Active (`LabelColor.blue`)
- Nonstatus green for Active only (`LabelColor.green`), with Upcoming and Expired on the default outline label
- Green for Active and red for Expired

## Decision Outcome

Chosen option: **nonstatus green for Active only**. `color={LabelColor.green}` with `variant="outline"`. Upcoming and Expired stay the default outline label. The label `status` prop stays unset, because `status="success"` would add a success icon and present the phase as a severity. Red for Expired remains rejected.

Related plan: [0002-active-rate-label.md](../plans/0002-active-rate-label.md).

### Consequences

- Good, because Active scans as the current rate in the color UX requested, without treating Expired as an error.
- Bad, because green is also the success association. Leaving the status icon off and keeping Expired neutral reduces that reading.
