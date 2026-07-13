/**
 * Tests for authentication: toolbar logout and axios 401 redirect.
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

  describe('Axios 401 interceptor', () => {
    beforeEach(() => {
      cy.interceptLogout();

      // Load normal API mocks first (including /api/me), then override the
      // routes we want to diverge from the defaults. Cypress's last-registered
      // route wins, so overrides must come AFTER loadApiInterceptors.
      cy.loadApiInterceptors();

      cy.intercept(
        { method: 'GET', pathname: '/api/cost-management/v1/user-access/' },
        { statusCode: 401, body: { detail: 'Authentication credentials were not provided.' } }
      ).as('unauthorizedRequest');
    });

    it('should redirect to /logout when the backend returns 401', () => {
      cy.visit('/openshift/cost-management');

      cy.url().should('include', '/logout');
    });
  });
});
