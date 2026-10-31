---
date: 2026-10-30
spec: ../specs/0002-active-rate-label.md
decisions:
  - ../decisions/0002-001-blue-active-label.md
---

# Blue outline for the Active exchange rate status

Implements [COST-8544](https://redhat.atlassian.net/browse/COST-8544). Active is a date-range phase, so the label uses nonstatus blue (`color={LabelColor.blue}`) and not `status="info"`. The info status would add an info icon. Upcoming and Expired stay the default outline label.

## Code

In [exchangeRateTable.tsx](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx), the status cell is:

```142:145:apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.tsx
value: rate?.status ? (
  <Label variant="outline">
    {intl.formatMessage(messages.exchangeRateStatus, { value: rate.status })}
  </Label>
```

Import `LabelColor` from `@patternfly/react-core` with `Label`. Pass `color={LabelColor.blue}` only when `rate.status === 'active'`. Leave the `status` prop unset.

## Test

The static-rate fixture in [exchangeRateTable.test.tsx](../../apps/koku-ui-hccm/src/routes/settings/exchangeRates/exchangeRate/exchangeRateTable.test.tsx) has no `status`, and the `DataTable` mock does not render child cells. Render child row cells from that mock, then add one test with Active, Upcoming, and Expired rates:

- Active label has the PatternFly blue modifier and no icon.
- Upcoming and Expired labels keep the default outline label and have no icon.
- The visible words stay `status:active`, `status:upcoming`, and `status:expired`.

Run the exchange rate table test.

## Docs

This is a planned UI change with a rejected alternative (green Active, red Expired). On implementation, save the approved plan and spec as `0002-active-rate-label`, and decision `0002-001` for that color fork. No RFE.
