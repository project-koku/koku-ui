/**
 * E2E tests for the Sources tab in the Settings page.
 * The Sources MFE is loaded as a federated module via Scalprum.
 */

const SETTINGS_URL = '/openshift/cost-management/settings';

const navigateToSourcesTab = () => {
  cy.visit(SETTINGS_URL);
  cy.waitForFederatedModule();
  cy.get('[role="tab"]').contains('Sources').click();
};

describe('Sources tab', () => {
  describe('Empty state', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesEmpty();
      navigateToSourcesTab();
    });

    it('should display the Sources tab in the Settings page', () => {
      cy.get('[role="tab"]').contains('Sources').should('be.visible');
    });

    it('should show the empty state with source type tiles when no sources exist', () => {
      cy.contains('Get started by connecting your sources').should('be.visible');
      cy.contains('Select an available provider.').should('be.visible');

      cy.contains('OpenShift Container Platform').should('exist');
      cy.contains('Amazon Web Services').should('exist');
      cy.contains('Microsoft Azure').should('exist');
      cy.contains('Google Cloud Platform').scrollIntoView().should('be.visible');
    });

    it('should open the Add Source wizard when clicking a source type tile', () => {
      cy.get('#source-type-OCP').click({ force: true });

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('Add an OpenShift source').should('be.visible');
    });
  });

  describe('Sources table', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesCRUD();
      navigateToSourcesTab();
    });

    it('should display the sources table with data', () => {
      cy.contains('My OpenShift Cluster').should('be.visible');
      cy.contains('AWS Production Account').should('be.visible');
      cy.contains('OpenShift Container Platform').should('be.visible');
      cy.contains('Amazon Web Services').should('be.visible');
    });

    it('should show the Add source button in the toolbar', () => {
      cy.contains('button', 'Add source').should('be.visible');
    });

    it('should open the Add Source wizard from the toolbar button', () => {
      cy.contains('button', 'Add source').click();

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('Add source').should('be.visible');
    });
  });

  describe('Add Source wizard', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesCRUD();
      navigateToSourcesTab();
    });

    it('should walk through the OCP wizard flow and submit', () => {
      cy.contains('button', 'Add source').click();
      cy.get('.pf-v6-c-modal-box').should('be.visible');

      // Step 1: Select source type — click the OCP card via its radio input
      cy.get('.pf-v6-c-modal-box').find('#card-select-OCP').click({ force: true });
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 2: Source name
      cy.get('.pf-v6-c-modal-box').find('input[name="source_name"]').type('E2E Test Source');
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 3: OCP credentials — cluster ID
      cy.get('.pf-v6-c-modal-box')
        .find('input[name="credentials.cluster_id"]')
        .type('e2e-cluster-12345');
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 4: Review — verify we reached the review step by checking the summary
      cy.get('.pf-v6-c-modal-box').contains('Source name').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('E2E Test Source').should('be.visible');

      // Submit
      cy.get('.pf-v6-c-modal-box').contains('button', 'Submit').click();

      cy.wait('@createSource');
      cy.wait('@createApplication');

      // Modal should close after successful submission
      cy.get('.pf-v6-c-modal-box').should('not.exist');
    });
  });

  describe('Kebab actions', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesCRUD();
      navigateToSourcesTab();
    });

    it('should pause a source from the kebab menu', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();

      cy.contains('Pause').click();

      cy.wait('@updateSource');
    });

    it('should open the remove modal from the kebab menu', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();

      cy.contains('Remove').click();

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('My OpenShift Cluster').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('cannot be undone').should('be.visible');
    });

    it('should submit the remove and close the modal', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();
      cy.contains('Remove').click();

      cy.get('.pf-v6-c-modal-box').contains('button', 'Remove').click();

      cy.wait('@deleteSource');
      cy.get('.pf-v6-c-modal-box').should('not.exist');
    });

    it('should navigate to details from the kebab menu', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();

      cy.contains('View details').click();

      cy.contains('Source summary').should('be.visible');
    });
  });
});
