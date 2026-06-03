/**
 * Live on-prem smoke: IAM expandable sidebar (FLPATH-4164 Stefan nav).
 * Requires npm run start:onprem:dev — not for CI.
 */
import { HostNavPage, IAM_NAV_HREFS } from '../../support/pages/host-nav.page';

type IamNavLabel = keyof typeof IAM_NAV_HREFS;

describe('Live IAM sidebar navigation', { testTimeout: 180_000 }, () => {
  beforeEach(() => {
    cy.setupLiveConsoleGuard();
    HostNavPage.visitCostOverview();
  });

  afterEach(() => {
    cy.assertNoDepthConsoleErrors();
  });

  it('iam-nav-overview', () => {
    HostNavPage.clickIamNav('Overview');
    cy.contains('h1', /User Access/i, { timeout: 30_000 }).should('be.visible');
  });

  it('iam-nav-mua', () => {
    HostNavPage.clickIamNav('My User Access');
    cy.contains('h1', /My User Access/i, { timeout: 30_000 }).should('be.visible');
  });

  it('iam-nav-users', () => {
    HostNavPage.clickIamNav('Users');
    cy.contains('h1', /^Users$/i, { timeout: 30_000 }).should('be.visible');
  });

  it('iam-nav-roles', () => {
    HostNavPage.clickIamNav('Roles');
    cy.contains('h1', /^Roles$/i, { timeout: 30_000 }).should('be.visible');
  });

  it('iam-nav-groups', () => {
    HostNavPage.clickIamNav('Groups');
    cy.contains('h1', /^Groups$/i, { timeout: 30_000 }).should('be.visible');
  });
});

describe('Live IAM sidebar — preserve /iam URL prefix', { testTimeout: 180_000 }, () => {
  beforeEach(() => {
    cy.setupLiveConsoleGuard();
  });

  afterEach(() => {
    cy.assertNoDepthConsoleErrors();
  });

  it('iam-nav-anchors-use-full-iam-href', () => {
    HostNavPage.visitIamUsers();
    HostNavPage.assertIamNavAnchorsUseFullIamHref();
  });

  it('iam-to-iam-users-to-overview', () => {
    HostNavPage.visitIamUsers();
    HostNavPage.clickIamNav('Overview');
    cy.location('pathname').should('eq', '/iam/user-access/overview');
    cy.contains('h1', /User Access/i, { timeout: 30_000 }).should('be.visible');
  });

  it('iam-to-iam-chain-preserves-prefix', () => {
    HostNavPage.visitIamUsers();
    const hops: IamNavLabel[] = ['My User Access', 'Roles', 'Groups', 'Overview', 'Users'];
    hops.forEach(label => {
      HostNavPage.clickIamNav(label);
      cy.location('pathname').should('eq', IAM_NAV_HREFS[label]);
    });
  });
});
