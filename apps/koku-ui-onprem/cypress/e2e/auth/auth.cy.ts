/**
 * Tests for authentication: toolbar logout and axios 401 redirect.
 */

describe('Authentication', () => {
  describe('Logout button', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/me', {
        statusCode: 200,
        body: { username: 'testuser' },
      }).as('getMe');

      cy.interceptLogout();
      cy.loadApiInterceptors();
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
      cy.intercept('GET', '/api/me', {
        statusCode: 200,
        body: { username: 'testuser' },
      }).as('getMe');

      cy.interceptLogout();

      // Load normal API mocks first, then override user-access with 401.
      // Cypress uses the most recently defined matching intercept,
      // so the 401 below takes precedence over the 200 from loadApiInterceptors.
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
