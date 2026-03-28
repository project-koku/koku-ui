/**
 * E2E tests for the Integrations tab (federated Sources MFE) on the Settings page.
 * The MFE is loaded via Scalprum with scope "sources".
 */

const SETTINGS_URL = '/openshift/cost-management/settings';

const navigateToIntegrationsTab = () => {
  cy.visit(SETTINGS_URL);
  cy.waitForFederatedModule();
  cy.get('[role="tab"]').contains('Integrations').click();
};

describe('Integrations tab', () => {
  describe('Empty state', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesEmpty();
      navigateToIntegrationsTab();
    });

    it('should display the Integrations tab in the Settings page', () => {
      cy.get('[role="tab"]').contains('Integrations').should('be.visible');
    });

    it('should show the empty state with OCP provider tile when no integrations exist', () => {
      cy.contains('Get started by connecting your integrations').should('be.visible');
      cy.contains('Select an available provider.').should('be.visible');

      cy.get('#source-type-OCP').should('exist');
      cy.get('#source-type-AWS').should('not.exist');
    });

    it('should open the Add integration wizard when clicking a provider tile', () => {
      cy.get('#source-type-OCP').click({ force: true });

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('Add an OpenShift integration').should('be.visible');
    });
  });

  describe('Integrations table', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesCRUD();
      navigateToIntegrationsTab();
    });

    it('should display the integrations table with data', () => {
      cy.contains('My OpenShift Cluster').should('be.visible');
      cy.contains('AWS Production Account').should('be.visible');
      cy.contains('OpenShift Container Platform').should('be.visible');
      cy.contains('Amazon Web Services').should('be.visible');
    });

    it('should show the Add integration button in the toolbar', () => {
      cy.contains('button', 'Add integration').should('be.visible');
    });

    it('should open the Add integration wizard from the toolbar button', () => {
      cy.contains('button', 'Add integration').click();

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('Add integration').should('be.visible');
    });
  });

  describe('Add integration wizard', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesCRUD();
      navigateToIntegrationsTab();
    });

    it('should walk through the OCP wizard flow and submit', () => {
      cy.contains('button', 'Add integration').click();
      cy.get('.pf-v6-c-modal-box').should('be.visible');

      // Step 1: Select integration type — click the OCP card via its radio input
      cy.get('.pf-v6-c-modal-box').find('#card-select-OCP').click({ force: true });
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 2: Integration name
      cy.get('.pf-v6-c-modal-box').find('input[name="source_name"]').type('E2E Test Source');
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 3: OCP credentials — cluster ID
      cy.get('.pf-v6-c-modal-box').find('input[name="credentials.cluster_id"]').type('e2e-cluster-12345');
      cy.get('.pf-v6-c-modal-box').contains('button', 'Next').click();

      // Step 4: Review — verify we reached the review step by checking the summary
      cy.get('.pf-v6-c-modal-box').contains('Integration name').should('be.visible');
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
      navigateToIntegrationsTab();
    });

    it('should pause an integration from the kebab menu and show a success toast', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();

      cy.contains('Pause').click();

      cy.wait('@updateSource');
      // Insights notifications render in .notifications-portal (PatternFly Alert; role may vary by PF version)
      cy.contains('Integration paused', { timeout: 15000 }).should('be.visible');
    });

    it('should show a danger toast when pause fails (Insights notification)', () => {
      cy.intercept(
        {
          method: 'PATCH',
          url: /\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
        },
        {
          statusCode: 400,
          body: { detail: 'E2E: pause rejected' },
        }
      ).as('pauseRejected');

      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();
      cy.contains('Pause').click();

      cy.wait('@pauseRejected');
      cy.contains('Could not pause integration', { timeout: 15000 }).should('be.visible');
      cy.contains('E2E: pause rejected').should('be.visible');
    });

    it('should show a success toast when resuming after pause', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();
      cy.contains('Pause').click();
      cy.wait('@updateSource');
      cy.contains('Integration paused', { timeout: 15000 }).should('be.visible');

      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();
      cy.contains('Resume').click();
      cy.wait('@updateSource');
      cy.contains('Integration resumed', { timeout: 15000 }).should('be.visible');
    });

    it('should open the remove modal from the kebab menu', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();

      cy.contains('Remove').click();

      cy.get('.pf-v6-c-modal-box').should('be.visible');
      cy.get('.pf-v6-c-modal-box').contains('Are you sure you want to remove').should('be.visible');
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

      cy.contains('Integration summary').should('be.visible');
    });
  });

  describe('Integrations table — large mocked dataset', () => {
    beforeEach(() => {
      cy.loadApiInterceptors();
      cy.interceptSourcesWithDataset({ total: 47 });
      navigateToIntegrationsTab();
    });

    it('should show the first page of integrations', () => {
      cy.contains('Integration 1').should('be.visible');
      cy.get('table tbody tr').should('have.length', 10);
    });

    it('should go to the next page', () => {
      cy.contains('Integration 1').should('be.visible');
      cy.get('button[aria-label="Go to next page"]').click();
      cy.contains('Integration 11').should('be.visible');
    });

    it('should filter by name via search', () => {
      cy.get('input[placeholder="Filter by name"]').clear().type('Integration 47{enter}');
      cy.contains('Integration 47').should('be.visible');
      cy.contains('Integration 1').should('not.exist');
    });

    it('should open integration detail from the kebab menu', () => {
      cy.get('table').find('[data-ouia-component-type="PF6/Dropdown"] button, .pf-v6-c-menu-toggle').first().click();
      cy.contains('View details').click();
      cy.get('h1').contains('Integration 1').should('be.visible');
      cy.contains('Integration summary').should('be.visible');
    });
  });
});
