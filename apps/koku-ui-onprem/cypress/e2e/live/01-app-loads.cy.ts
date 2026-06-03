/**
 * Live on-prem smoke: RBAC manifest + IAM + cost routes (FLPATH-4164).
 * Requires npm run start:onprem:dev — not for CI.
 */
import { IamPage } from '../../support/pages/iam.page';
import { HostNavPage } from '../../support/pages/host-nav.page';

describe('Live app loads', { testTimeout: 180_000 }, () => {
  beforeEach(() => {
    cy.setupLiveConsoleGuard();
  });

  afterEach(() => {
    cy.assertNoDepthConsoleErrors();
  });

  it('rbac-plugin-manifest', () => {
    cy.request('/rbac/plugin-manifest.json').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ name: 'insightsRbac', baseURL: '/rbac/' });
    });
  });

  it('iam-my-user-access-loads', () => {
    IamPage.visitMyUserAccess();
  });

  it('cost-overview-loads', () => {
    HostNavPage.visitCostOverview();
    cy.url({ timeout: 30_000 }).should('include', '/openshift/cost-management');
    cy.title().should('match', /cost management/i);
  });
});
