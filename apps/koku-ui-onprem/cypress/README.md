# koku-ui-onprem Cypress

## Layout

| Folder | Purpose | Command |
|--------|---------|---------|
| [`e2e/integration/`](e2e/integration/) | Integration tests with `cy.loadApiInterceptors()` (mocked APIs, no cluster) | `npm run test:cypress` |
| [`e2e/live/`](e2e/live/) | E2E tests against real APIs via dev proxy (FLPATH-4164) | `npm run test:cypress:live` |

Live specs: `01`–`04` (**21** tests) for local `start:onprem:dev`. The `test:cypress:live` script unsets `ELECTRON_RUN_AS_NODE` when present (IDE sandboxes) so Cypress binary verify can run on macOS.

## E2E (live, not CI)

**Do not** wire `test:cypress:live` into CI. It requires a developer machine with:

1. `oc login` to a cluster with Cost Management deployed
2. `npm run start:onprem:dev` from koku-ui root (sources `scripts/setup-onprem-env.sh` and starts the full on-prem stack)
3. In another terminal: `npm run test:cypress:live`

Automatable pre-merge check: `npm run verify:onprem` (RBAC manifest/build only).

## Integration tests

From `apps/koku-ui-onprem` or koku-ui root:

```bash
npm run test:cypress
npm run test:cypress:open
```

Default `cypress.config.ts` `specPattern` includes **integration only**. E2E live specs are excluded unless you pass `--spec 'cypress/e2e/live/**/*.cy.ts'`.

## Support

- [`support/commands.ts`](support/commands.ts) — API mocks, `setupLiveConsoleGuard` / `assertNoDepthConsoleErrors` (live e2e)
- [`support/pages/`](support/pages/) — page objects for live IAM and host nav
