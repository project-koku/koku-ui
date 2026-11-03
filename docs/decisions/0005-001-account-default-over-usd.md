---
status: accepted
date: 2026-11-03
---

# Prefer account default over hardcoded USD

## Context and Problem Statement

When the session display currency is disabled in Exchange rates, the UI must pick a safe replacement so report APIs no longer send a disabled `currency=` value. The obvious fallback is `USD`, which is also the hardcoded default inside `getCurrency` / `getAccountCurrency` when nothing is stored.

## Considered Options

- Always `setCurrency('USD')` when the current session currency is disabled
- `setCurrency(getAccountCurrency())`, which already defaults to `USD` when unset

## Decision Outcome

Chosen option: **`setCurrency(getAccountCurrency())`**. The account default is the same seed `initCurrency` uses, and the backend marks it `is_disableable: false`, so it remains a valid report currency. Hardcoding `'USD'` would ignore a non-USD account default the user already configured.

Related plan: [0005-disabled-currency-fallback.md](../plans/0005-disabled-currency-fallback.md).

### Consequences

- Good, because disable recovery matches how the UI currency is first seeded.
- Good, because accounts whose default is not USD keep that preference after a disabled selection is cleared.
- Neutral, because when account currency is unset or is USD, behavior matches a hardcoded USD reset.
