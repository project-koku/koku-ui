/**
 * Host chrome navigation (cost shell ↔ IAM).
 */
export const IAM_EXPANDABLE_TITLE = 'Identity and Access Management';

export const IAM_NAV_HREFS: Record<string, string> = {
  Overview: '/iam/user-access/overview',
  'My User Access': '/iam/my-user-access',
  Users: '/iam/user-access/users',
  Roles: '/iam/user-access/roles',
  Groups: '/iam/user-access/groups',
};

export const HostNavPage = {
  visitCostOverview() {
    cy.visit('/openshift/cost-management');
  },

  expandIdentityAndAccessManagement() {
    cy.contains('button', IAM_EXPANDABLE_TITLE).then($toggle => {
      if ($toggle.attr('aria-expanded') === 'false') {
        cy.wrap($toggle).click();
      }
    });
  },

  clickIamNav(label: keyof typeof IAM_NAV_HREFS) {
    const href = IAM_NAV_HREFS[label];
    this.expandIdentityAndAccessManagement();
    cy.contains(`a[href="${href}"]`, label).click();
    cy.url({ timeout: 30_000 }).should('include', href);
    this.assertPathnameUnderIam();
  },

  /** Regression: IAM sidebar links must use `/iam/...` hrefs, not basename-relative paths. */
  assertIamNavAnchorsUseFullIamHref() {
    this.expandIdentityAndAccessManagement();
    Object.values(IAM_NAV_HREFS).forEach(href => {
      cy.get(`nav a[href="${href}"]`).should('exist');
    });
    cy.get('nav a[href^="/user-access"]').should('not.exist');
    cy.get('nav a[href^="/my-user-access"]').should('not.exist');
  },

  assertPathnameUnderIam() {
    cy.location('pathname', { timeout: 30_000 }).should('match', /^\/iam(\/|$)/);
  },

  visitIamUsers() {
    cy.visit('/iam/user-access/users');
    cy.contains('h1', /^Users$/i, { timeout: 30_000 }).should('be.visible');
    this.assertPathnameUnderIam();
  },

  clickOverview() {
    cy.contains('button', /^Overview$/).click({ timeout: 5_000 });
    cy.url({ timeout: 45_000 }).should('include', '/openshift/cost-management');
  },

  clickSettings() {
    cy.contains('button', /^Settings$/).click({ timeout: 5_000 });
    cy.url({ timeout: 45_000 }).should('include', '/openshift/cost-management/settings');
  },

  clickOptimizations() {
    cy.contains('button', /^Optimizations$/).click({ timeout: 5_000 });
    cy.url({ timeout: 45_000 }).should('include', '/openshift/cost-management/optimizations');
  },

  clickMyUserAccessLink() {
    this.clickIamNav('My User Access');
  },
};
