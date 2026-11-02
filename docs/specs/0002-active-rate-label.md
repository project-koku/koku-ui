---
date: 2026-11-02
plan: ../plans/0002-active-rate-label.md
---

# Active exchange rate status label

## Context

Settings → Exchange rates shows Active, Upcoming, and Expired as outline labels in the status column. Those words are phases of a rate's date range. QE asked for colored labels, with green for Active and red for Expired. UX later asked for light green on Active only. [COST-8544](https://redhat.atlassian.net/browse/COST-8544) tracks the UI change.

PatternFly success green means an action succeeded and, on a status label, adds a checkmark icon. Danger red means a critical or destructive error, and the label guidelines say to avoid red unless the label indicates danger or an error. Nonstatus green (`LabelColor.green`) is the outline palette color UX called light green.

## Requirements

- The Active label uses a nonstatus green outline: `color={LabelColor.green}` from `@patternfly/react-core`, with `variant="outline"`.
- The label `status` prop stays unset, so no status icon is shown.
- Upcoming and Expired stay the default outline label.
- The words stay Active, Upcoming, and Expired.

## Considered options

- Green for Active and red for Expired. Rejected for Expired; red still reads as danger. See [0002-002-green-active-label.md](../decisions/0002-002-green-active-label.md).
- Nonstatus blue for Active only. Chosen first, then superseded after UX asked for light green. See [0002-001-blue-active-label.md](../decisions/0002-001-blue-active-label.md).
- PatternFly `status="success"` or `status="info"`, which add a status icon. Rejected: the icon would present a date-range phase as a severity.

## Outcome

Only the Active status label is green. It is an outline label with `LabelColor.green` and no icon. Upcoming and Expired remain the default outline label in `apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx`.
