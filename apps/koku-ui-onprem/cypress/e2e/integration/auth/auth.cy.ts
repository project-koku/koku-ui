/**
 * Tests for authentication: toolbar logout.
 */

describe('Authentication', () => {
  describe('Logout button', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      // Override the /api/me mock registered by loadApiInterceptors so UserMenu
      // shows a deterministic test username. Cypress's last-registered route wins,
      // so this must come AFTER loadApiInterceptors.
      cy.intercept('GET', '/api/me', {
        statusCode: 200,
        body: { username: 'testuser' },
      }).as('getMe');

      cy.interceptLogout();
    });

    it('should display the username fetched from /api/me', () => {
      cy.visit('/openshift/cost-management');

      cy.wait('@getMe');
      cy.get('#userMenu').should('contain.text', 'testuser');
    });

    it('should navigate to /logout when clicking the Logout button', () => {
      cy.visit('/openshift/cost-management');

      cy.wait('@getMe');
      cy.get('#userMenu').should('contain.text', 'testuser');

      cy.get('#userMenu').click();
      cy.contains('Logout').click();

      cy.url().should('include', '/logout');
    });
  });
});
