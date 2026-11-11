---
status: accepted
date: 2026-11-10
---

# Truncate over format fraction cap in the exchange rate table

## Context and Problem Statement

Exchange rates allow up to 15 decimals. The static-rate nested table has limited space. We needed a compact cell without losing the ability to recover the full value from the table UI.

Related plan: [0008-exchange-rate-truncate.md](../plans/0008-exchange-rate-truncate.md).

## Considered Options

- Format the rate with `maximumFractionDigits: 10` in the table only.
- Format with up to 15 decimals and wrap the cell in PatternFly `Truncate` (ellipsis + tooltip).

## Decision Outcome

Chosen option: PatternFly `Truncate` with a 15-decimal formatted string, because format-capping to 10 permanently hides digits 11–15 in the cell with no tooltip recovery.

### Consequences

- The rate column needs a width constraint so Truncate’s container-based ellipsis activates.
- Shared cost-model formatter defaults remain at 10 decimals.
