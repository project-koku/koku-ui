/**
 * Live on-prem smoke: host ↔ IAM navigation (FLPATH-4164).
 * Requires npm run start:onprem:dev — not for CI.
 */
import { IamPage } from '../../support/pages/iam.page';
import { HostNavPage } from '../../support/pages/host-nav.page';

describe('Live host IAM navigation', { testTimeout: 180_000 }, () => {
  beforeEach(() => {
    cy.setupLiveConsoleGuard();
  });

  afterEach(() => {
    cy.assertNoDepthConsoleErrors();
  });

  it('iam-sidebar-toggle', () => {
    IamPage.visitMyUserAccess();
    IamPage.toggleGlobalNavTwice();
  });

  it('iam-to-overview', () => {
    IamPage.visitMyUserAccess();
    HostNavPage.clickOverview();
  });

  it('iam-to-settings', () => {
    IamPage.visitMyUserAccess();
    HostNavPage.clickSettings();
  });

  it('iam-to-optimizations', () => {
    IamPage.visitMyUserAccess();
    HostNavPage.clickOptimizations();
  });

  it('cost-to-iam-roundtrip', () => {
    HostNavPage.visitCostOverview();
    HostNavPage.clickMyUserAccessLink();
    HostNavPage.clickOverview();
  });
});
