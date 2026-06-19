/**
 * Tests for federated module setup in the onprem application.
 * These tests verify that the Overview and Optimizations pages render correctly,
 * which validates proper module federation configuration.
 */

describe('Federated Modules', () => {
  beforeEach(() => {
    // Load API interceptors before each test to mock Cost Management API calls
    cy.loadApiInterceptors();
  });

  describe('Overview page', () => {
    it('should render the Overview page when accessing the root URL', () => {
      cy.visit('/');

      // Should redirect to /openshift/cost-management
      cy.url().should('include', '/openshift/cost-management');

      // Navigation should show Overview as active
      cy.get('nav').contains('Overview').should('be.visible');
    });

    it('should render the Overview page with federated content', () => {
      cy.visit('/openshift/cost-management');

      // Wait for the federated module to load
      cy.waitForFederatedModule();

      // Verify the page container is visible
      cy.get('#primary-app-container').should('be.visible');

      cy.get('h1').should('contain.text', 'Cost management overview');
    });

    it('should navigate to Overview page from sidebar', () => {
      cy.visit('/openshift/cost-management/optimizations');

      // Click on Overview in the navigation
      cy.get('nav').contains('Overview').click();

      // Verify URL changed
      cy.url().should('eq', Cypress.config().baseUrl + '/openshift/cost-management');

      // Wait for federated module to load
      cy.waitForFederatedModule();
    });
  });

  describe('Optimizations page', () => {
    it('should render the Optimizations page with federated content', () => {
      cy.visit('/openshift/cost-management/optimizations');

      // Wait for the federated module to load
      cy.waitForFederatedModule();

      // Verify the page container is visible
      cy.get('#primary-app-container').should('be.visible');

      cy.get('h1').should('contain.text', 'Optimizations');
    });

    it('should navigate to Optimizations page from sidebar', () => {
      cy.visit('/openshift/cost-management');

      // Wait for initial page to load
      cy.waitForFederatedModule();

      // Click on Optimizations in the navigation
      cy.get('nav').contains('Optimizations').click();

      // Verify URL changed
      cy.url().should('include', '/openshift/cost-management/optimizations');

      // Wait for federated module to load
      cy.waitForFederatedModule();
    });
  });
});
