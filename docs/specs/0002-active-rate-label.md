---
date: 2026-10-30
plan: ../plans/0002-active-rate-label.md
---

# Active exchange rate status label

## Context

Settings → Exchange rates shows Active, Upcoming, and Expired as outline labels in the status column. Those words are phases of a rate's date range. QE asked for colored labels, with green for Active and red for Expired. [COST-8544](https://redhat.atlassian.net/browse/COST-8544) tracks the UI change.

PatternFly success green means an action succeeded. Danger red means a critical or destructive error, and the label guidelines say to avoid red unless the label indicates danger or an error. The label `status` values also add a status icon.

## Requirements

- The Active label uses a nonstatus blue outline: `color={LabelColor.blue}` from `@patternfly/react-core`, with `variant="outline"`.
- The label `status` prop stays unset, so no status icon is shown.
- Upcoming and Expired stay the default outline label.
- The words stay Active, Upcoming, and Expired.

## Considered options

- Green for Active and red for Expired. Rejected. See [0002-001-blue-active-label.md](../decisions/0002-001-blue-active-label.md).
- PatternFly `status="info"`, which is blue and includes an info icon. Rejected for the same reason: the icon would present a date-range phase as a status severity.

## Outcome

Only the Active status label is blue. It is an outline label with `LabelColor.blue` and no icon. Upcoming and Expired remain the default outline label in `apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx`.
