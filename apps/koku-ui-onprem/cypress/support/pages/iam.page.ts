/**
 * IAM federated remote (live stack — no API mocks).
 */
export const IamPage = {
  visitMyUserAccess() {
    cy.visit('/iam/my-user-access?bundle=openshift');
    cy.contains('h1', /My User Access/i, { timeout: 30_000 }).should('be.visible');
  },

  visitIamOverview() {
    cy.visit('/iam/user-access/overview');
    cy.contains('h1', /User Access/i, { timeout: 30_000 }).should('be.visible');
  },

  visitUsers() {
    cy.visit('/iam/user-access/users');
    cy.contains('h1', /^Users$/i, { timeout: 30_000 }).should('be.visible');
  },

  visitGroups() {
    cy.visit('/iam/user-access/groups');
    cy.contains('h1', /^Groups$/i, { timeout: 30_000 }).should('be.visible');
  },

  visitRoles() {
    cy.visit('/iam/user-access/roles');
    cy.contains('h1', /^Roles$/i, { timeout: 30_000 }).should('be.visible');
  },

  toggleGlobalNav() {
    const started = Date.now();
    cy.get('button[aria-label="Global navigation"]').click({ timeout: 5_000 });
    cy.then(() => {
      expect(Date.now() - started).to.be.lessThan(2_000);
    });
  },

  toggleGlobalNavTwice() {
    this.toggleGlobalNav();
    this.toggleGlobalNav();
  },
};
