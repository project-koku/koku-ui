// eslint-disable-next-line no-restricted-imports -- Cypress helpers live under cypress/support; parent import is intentional.
import {
  makeMockSource,
  registerSourcesIntegrationApi,
  type SourcesIntegrationStore,
} from '../../support/sources-integration-intercepts';

const visitIntegrationsTab = (options?: { emptyListOk?: boolean }) => {
  cy.visit('/openshift/cost-management/settings');
  cy.contains('h1', 'Cost management settings', { timeout: 30000 }).should('be.visible');
  cy.contains('button', 'Integrations', { timeout: 30000 }).click();
  cy.get('.pf-v6-c-spinner', { timeout: 30000 }).should('not.exist');
  cy.get('body').should($body => {
    const hasTable = $body.find('table[aria-label="Integrations table"]').length > 0;
    const hasEmpty = $body.text().includes('Get started by connecting your integrations');
    if (options?.emptyListOk) {
      void expect(hasTable || hasEmpty, 'integrations list or empty state').to.be.true;
    } else {
      void expect(hasTable, 'integrations table').to.be.true;
    }
  });
};

const openRowActions = (rowText: string) => {
  cy.contains('tr', rowText).within(() => {
    cy.get('td').last().find('button').first().click();
  });
};

const selectIntegrationsFilterField = (label: 'Name' | 'Status') => {
  cy.get('button[aria-label="Filter integrations by field"]').click();
  cy.get('[role="listbox"]').contains('[role="option"]', label).click();
};

const applyAvailabilityFilter = () => {
  cy.get('button[aria-label="Apply availability filter"]').click();
};

const completeAddIntegrationWizard = (name: string, clusterId: string) => {
  cy.contains('h2', 'Integration name', { timeout: 15000 }).should('be.visible');
  cy.get('#source_name').clear();
  cy.get('#source_name').type(name);
  cy.contains('button', 'Next').should('be.enabled').click();
  cy.get('[id="credentials.cluster_id"]').clear();
  cy.get('[id="credentials.cluster_id"]').type(clusterId);
  cy.contains('button', 'Next').click();
  cy.contains('button', 'Submit').click();
};

describe('Settings — Integrations (Sources)', () => {
  const store: SourcesIntegrationStore = { rows: [] };

  beforeEach(() => {
    store.rows = [];
    cy.loadApiInterceptors();
    registerSourcesIntegrationApi(store);
    cy.interceptLogout();
  });

  it('filters by name and shows empty state when nothing matches', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        name: 'filterable-unique',
      }),
    ];
    visitIntegrationsTab();
    cy.get('[placeholder="Filter by name"]').clear();
    cy.get('[placeholder="Filter by name"]').type('filterable{enter}');
    cy.contains('tr', 'filterable-unique').should('exist');
    cy.get('[placeholder="Filter by name"]').clear();
    cy.get('[placeholder="Filter by name"]').type('does-not-exist{enter}');
    cy.contains('No integrations match your filters').should('be.visible');
  });

  it('filters by status (Available)', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        name: 'available-src',
        active: true,
        paused: false,
      }),
      makeMockSource({
        id: 2,
        uuid: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        name: 'paused-src',
        active: true,
        paused: true,
      }),
    ];
    visitIntegrationsTab();
    selectIntegrationsFilterField('Status');
    cy.contains('button', 'Filter by status').click();
    cy.get('#sources-filter-status-available').check({ force: true });
    applyAvailabilityFilter();
    cy.contains('tr', 'available-src').should('exist');
    cy.contains('tr', 'paused-src').should('not.exist');
  });

  it('shows selected status radio while filter menu stays open', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        name: 'status-radio-ui-src',
        active: true,
        paused: false,
      }),
    ];
    visitIntegrationsTab();
    selectIntegrationsFilterField('Status');
    cy.contains('button', 'Filter by status').click();
    cy.get('#sources-filter-status-available').check({ force: true });
    cy.get('#sources-filter-status-available').should('be.checked');
    cy.get('#sources-filter-status-unavailable').should('not.be.checked');
    cy.get('#sources-filter-status-unavailable').check({ force: true });
    cy.get('#sources-filter-status-unavailable').should('be.checked');
    cy.get('#sources-filter-status-available').should('not.be.checked');
    cy.get('#sources-filter-status-available').check({ force: true });
    cy.get('#sources-filter-status-available').should('be.checked');
    applyAvailabilityFilter();
    cy.contains('tr', 'status-radio-ui-src').should('exist');
  });

  it('combines availability and name filters (AND)', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: 'd1111111-1111-4111-8111-111111111111',
        name: 'AWS-east',
        active: true,
        paused: false,
      }),
      makeMockSource({
        id: 2,
        uuid: 'd2222222-2222-4222-8222-222222222222',
        name: 'AWS-west',
        active: true,
        paused: true,
      }),
      makeMockSource({
        id: 3,
        uuid: 'd3333333-3333-4333-8333-333333333333',
        name: 'GCP-main',
        active: true,
        paused: false,
      }),
    ];
    visitIntegrationsTab();
    selectIntegrationsFilterField('Status');
    cy.contains('button', 'Filter by status').click();
    cy.get('#sources-filter-status-available').check({ force: true });
    applyAvailabilityFilter();
    selectIntegrationsFilterField('Name');
    cy.get('[placeholder="Filter by name"]').clear();
    cy.get('[placeholder="Filter by name"]').type('AWS{enter}');
    cy.contains('tr', 'AWS-east').should('exist');
    cy.contains('tr', 'AWS-west').should('not.exist');
    cy.contains('tr', 'GCP-main').should('not.exist');
  });

  it('paginates the integrations table', () => {
    store.rows = Array.from({ length: 12 }, (_, i) =>
      makeMockSource({
        id: i + 1,
        uuid: `20000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
        name: `page-src-${String(i + 1).padStart(2, '0')}`,
        created_timestamp: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T12:00:00Z`,
      })
    );
    visitIntegrationsTab();
    cy.contains('tr', 'page-src-01').should('exist');
    cy.contains('tr', 'page-src-10').should('exist');
    cy.contains('tr', 'page-src-11').should('not.exist');
    cy.get('[aria-label="Go to next page"]').filter(':visible').last().click();
    cy.contains('tr', 'page-src-11').should('exist');
    cy.contains('tr', 'page-src-12').should('exist');
    cy.contains('tr', 'page-src-01').should('not.exist');
  });

  it('adds an integration from the empty state', () => {
    visitIntegrationsTab({ emptyListOk: true });
    cy.contains('Get started by connecting your integrations').should('be.visible');
    cy.get('[data-ouia-component-id="sources-empty-add-openshift-card"]').click();
    completeAddIntegrationWizard('Empty-state OCP', 'cluster-empty-1');
    cy.contains('tr', 'Empty-state OCP').should('exist');
    cy.then(() => {
      void expect(store.rows.some(r => r.name === 'Empty-state OCP')).to.be.true;
    });
  });

  it('adds an integration when the list is not empty', () => {
    store.rows = [
      makeMockSource({
        id: 99,
        uuid: '40000000-0000-4000-8000-000000000099',
        name: 'Existing integration',
      }),
    ];
    visitIntegrationsTab();
    cy.contains('tr', 'Existing integration').should('exist');
    cy.contains('button', 'Add integration').click();
    completeAddIntegrationWizard('Second OCP integration', 'cluster-second-1');
    cy.contains('tr', 'Second OCP integration').should('exist');
  });

  it('removes an integration from the list', () => {
    store.rows = [
      makeMockSource({
        id: 5,
        uuid: '50000000-0000-4000-8000-000000000005',
        name: 'remove-me',
      }),
    ];
    visitIntegrationsTab();
    openRowActions('remove-me');
    cy.contains('button', 'Remove').click();
    cy.contains('Remove integration?').should('be.visible');
    cy.get('#remove-integration-acknowledge').check({ force: true });
    cy.contains('button', 'Remove integration and its data').click();
    cy.contains('tr', 'remove-me').should('not.exist');
    cy.then(() => {
      void expect(store.rows.find(r => r.name === 'remove-me')).to.be.undefined;
    });
  });

  it('renames an integration from the detail view', () => {
    store.rows = [
      makeMockSource({
        id: 7,
        uuid: '60000000-0000-4000-8000-000000000007',
        name: 'rename-original',
      }),
    ];
    visitIntegrationsTab();
    cy.contains('button', 'rename-original').click();
    cy.contains('h1', 'rename-original').should('be.visible');
    cy.get('button[aria-label="Actions"]').click();
    cy.contains('button', 'Rename').click();
    cy.get('#source-rename').clear();
    cy.get('#source-rename').type('rename-updated');
    cy.contains('button', 'Save').click();
    cy.get('#source-rename', { timeout: 15000 }).should('not.exist');
    cy.contains('h1', 'rename-updated').should('be.visible');
    cy.contains('button', 'Back to Integrations').click();
    cy.contains('tr', 'rename-updated').should('exist');
    cy.then(() => {
      void expect(store.rows.find(r => r.uuid === '60000000-0000-4000-8000-000000000007')?.name).to.eq(
        'rename-updated'
      );
    });
  });

  it('logs console.error when pause/resume fails', () => {
    cy.intercept('PATCH', '**/sources/70000000-0000-4000-8000-000000000008/**', {
      statusCode: 500,
      body: { errors: [{ detail: 'mock pause failure' }] },
    }).as('pauseRequest');
    store.rows = [
      makeMockSource({
        id: 8,
        uuid: '70000000-0000-4000-8000-000000000008',
        name: 'pause-fail-src',
        paused: false,
      }),
    ];
    cy.visit('/openshift/cost-management/settings', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });
    cy.contains('h1', 'Cost management settings', { timeout: 30000 }).should('be.visible');
    cy.contains('button', 'Integrations', { timeout: 30000 }).click();
    cy.get('table[aria-label="Integrations table"]', { timeout: 30000 }).should('be.visible');
    openRowActions('pause-fail-src');
    cy.get('[role="menu"]').contains('Pause').click({ force: true });
    cy.wait('@pauseRequest');
    cy.get('@consoleError').should(stub => {
      const s = stub as unknown as { callCount: number; getCall: (i: number) => { args: unknown[] } };
      let found = false;
      for (let i = 0; i < s.callCount; i++) {
        if (s.getCall(i).args[0] === 'Pause or resume integration failed') {
          found = true;
          break;
        }
      }
      void expect(found, 'console.error for pause/resume failure').to.be.true;
    });
  });

  it.skip('pauses an active integration (skipped: backend pause currently broken)', () => {
    store.rows = [
      makeMockSource({
        id: 9,
        uuid: '80000000-0000-4000-8000-000000000009',
        name: 'pause-when-fixed',
        paused: false,
      }),
    ];
    visitIntegrationsTab();
    openRowActions('pause-when-fixed');
    cy.contains('button', 'Pause').click();
    cy.contains('tr', 'pause-when-fixed').within(() => {
      cy.contains('.pf-v6-c-label', 'Paused').should('exist');
    });
  });
});
