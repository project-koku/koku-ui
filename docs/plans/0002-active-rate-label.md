---
date: 2026-11-02
spec: ../specs/0002-active-rate-label.md
decisions:
  - ../decisions/0002-001-blue-active-label.md
  - ../decisions/0002-002-green-active-label.md
---

# Green outline for the Active exchange rate status

Implements [COST-8544](https://redhat.atlassian.net/browse/COST-8544). Active is a date-range phase, so the label uses nonstatus green (`color={LabelColor.green}`) and not `status="success"`. The success status would add a success icon. Upcoming and Expired stay the default outline label. UX requested light green for Active; red for Expired remains unused.

## Code

In [exchangeRateTable.tsx](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx), the status cell is:

```142:145:apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx
value: rate?.status ? (
  <Label variant="outline">
    {intl.formatMessage(messages.exchangeRateStatus, { value: rate.status })}
  </Label>
```

Import `LabelColor` from `@patternfly/react-core` with `Label`. Pass `color={LabelColor.green}` only when `rate.status === 'active'`. Leave the `status` prop unset.

## Test

The static-rate fixture in [exchangeRateTable.test.tsx](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.test.tsx) has no `status`, and the `DataTable` mock does not render child cells. Render child row cells from that mock, then add one test with Active, Upcoming, and Expired rates:

- Active label has the PatternFly green modifier and no icon.
- Upcoming and Expired labels keep the default outline label and have no icon.
- The visible words stay `status:active`, `status:upcoming`, and `status:expired`.

Run the exchange rate table test.

## Docs

This is a planned UI change. The first fork chose blue over green Active with red Expired ([0002-001](../decisions/0002-001-blue-active-label.md)). UX later asked for light green on Active; that choice supersedes blue in [0002-002](../decisions/0002-002-green-active-label.md). No RFE.
