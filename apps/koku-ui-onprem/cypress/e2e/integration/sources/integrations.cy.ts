// eslint-disable-next-line no-restricted-imports -- Cypress helpers live under cypress/support; parent import is intentional.
import {
  makeMockSource,
  registerSourcesIntegrationApi,
  type SourcesIntegrationStore,
} from '../../../support/sources-integration-intercepts';

const visitIntegrationsTab = (options?: { emptyListOk?: boolean }) => {
  cy.visit('/openshift/cost-management/settings');
  cy.contains('h1', 'Cost management settings', { timeout: 30000 }).should('be.visible');
  cy.contains('button', 'Integrations', { timeout: 30000 }).click();
  cy.get('.pf-v6-c-spinner', { timeout: 30000 }).should('not.exist');
  cy.get('body').should($body => {
    const hasRow = $body.find('table tbody tr a').length > 0;
    const hasEmpty = $body.text().includes('Get started by connecting to your Red Hat applications');
    if (options?.emptyListOk) {
      void expect(hasRow || hasEmpty, 'integrations list or empty state').to.be.true;
    } else {
      void expect(hasRow, 'integrations table row').to.be.true;
    }
  });
};

const openRowActions = (rowText: string) => {
  cy.contains('tr', rowText).find('button[aria-label="Kebab toggle"]').click();
};

const filterByName = (value: string) => {
  cy.get('input[aria-label="Filter by name"], input[placeholder="Filter by Name"]').first().clear();
  cy.get('input[aria-label="Filter by name"], input[placeholder="Filter by Name"]').first().type(value);
};

const clickStatusOption = (status: 'Available' | 'Unavailable') => {
  cy.get('.pf-v6-c-menu__item').should('have.length.at.least', 1).then($items => {
    const match = [...$items].find(el => (el.textContent || '').trim() === status);
    if (!match) {
      throw new Error(`missing status option ${status}`);
    }
    cy.wrap(match).click();
  });
};

const selectStatusFilter = (status: 'Available' | 'Unavailable') => {
  cy.get('button[aria-label="Conditional filter toggle"]').then($toggle => {
    if (!$toggle.text().includes('Status')) {
      cy.wrap($toggle).click();
      cy.get('[aria-label="Conditional filters list"]').contains('button', 'Status').click();
    }
    cy.get('body').then($body => {
      const open = [...$body.find('.pf-v6-c-menu__item')].some(el => (el.textContent || '').trim() === status);
      if (!open) {
        cy.get('.ins-c-conditional-filter button[aria-label="Options menu"]').click();
      }
      clickStatusOption(status);
    });
  });
};

const typeNameStep = (name: string) => {
  cy.get('.pf-v6-c-wizard input[name="source.name"]').clear();
  cy.get('.pf-v6-c-wizard input[name="source.name"]').type(name);
  cy.contains('.pf-v6-c-wizard button', 'Next').should('be.enabled').click();
};

const typeClusterStep = (clusterId: string) => {
  cy.get('.pf-v6-c-wizard input[name="source.source_ref"]', { timeout: 15000 }).clear();
  cy.get('.pf-v6-c-wizard input[name="source.source_ref"]').type(clusterId);
  cy.contains('.pf-v6-c-wizard button', 'Next').should('be.enabled').click();
};

const finishWizard = (stepsLeft = 4) => {
  cy.get('.pf-v6-c-wizard').then($wizard => {
    if ($wizard.text().includes('Review details')) {
      cy.contains('.pf-v6-c-wizard button', /^Add$/).should('be.enabled').click();
      return;
    }
    if (stepsLeft <= 0) {
      throw new Error('Add integration wizard did not reach review');
    }
    cy.contains('.pf-v6-c-wizard button', 'Next').should('be.enabled').click();
    finishWizard(stepsLeft - 1);
  });
};

const completeAddFromTile = (name: string, clusterId: string) => {
  cy.contains('.pf-v6-c-tile', 'OpenShift Container Platform').should('be.visible').click();
  cy.contains('.pf-v6-c-wizard', 'Name integration', { timeout: 15000 }).should('be.visible');
  typeNameStep(name);
  cy.contains('.pf-v6-c-wizard label', 'Cost Management').click();
  cy.contains('.pf-v6-c-wizard button', 'Next').should('be.enabled').click();
  typeClusterStep(clusterId);
  finishWizard();
};

const completeAddFromButton = (name: string, clusterId: string) => {
  cy.get('#addSourceButton').should('be.enabled').click();
  cy.contains('.pf-v6-c-wizard .pf-v6-c-tile', 'OpenShift Container Platform', { timeout: 15000 }).click();
  cy.contains('.pf-v6-c-wizard .pf-v6-c-radio', 'Cost management').click();
  cy.contains('.pf-v6-c-wizard button', 'Next').should('be.enabled').click();
  typeNameStep(name);
  typeClusterStep(clusterId);
  finishWizard();
};

describe('Settings — Integrations (sources-ui)', () => {
  const store: SourcesIntegrationStore = { rows: [] };

  beforeEach(() => {
    store.rows = [];
    cy.loadApiInterceptors();
    cy.intercept('GET', '**/api/rbac/v1/access/**', {
      statusCode: 200,
      body: {
        data: [{ permission: 'sources:*:*', resourceDefinitions: [] }],
        meta: { count: 1, limit: 1000, offset: 0 },
      },
    }).as('rbacAccess');
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
    filterByName('filterable');
    cy.contains('tr', 'filterable-unique').should('exist');
    filterByName('does-not-exist');
    cy.contains('No sources found', { timeout: 15000 }).should('be.visible');
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
    selectStatusFilter('Available');
    cy.contains('tr', 'available-src').should('exist');
    cy.contains('tr', 'paused-src').should('not.exist');
  });

  it('filters by status (Unavailable) after Available', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        name: 'status-available-src',
        active: true,
        paused: false,
      }),
      makeMockSource({
        id: 2,
        uuid: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
        name: 'status-paused-src',
        active: true,
        paused: true,
      }),
    ];
    visitIntegrationsTab();
    selectStatusFilter('Available');
    cy.contains('tr', 'status-available-src').should('exist');
    selectStatusFilter('Unavailable');
    cy.contains('tr', 'status-paused-src').should('exist');
    cy.contains('tr', 'status-available-src').should('not.exist');
  });

  it('applies name and status filters together', () => {
    store.rows = [
      makeMockSource({
        id: 1,
        uuid: '11111111-1111-4111-8111-111111111111',
        name: 'AWS-east',
        active: true,
        paused: false,
      }),
      makeMockSource({
        id: 2,
        uuid: '22222222-2222-4222-8222-222222222222',
        name: 'AWS-west',
        active: true,
        paused: true,
      }),
      makeMockSource({
        id: 3,
        uuid: '33333333-3333-4333-8333-333333333333',
        name: 'GCP-main',
        active: true,
        paused: false,
      }),
    ];
    visitIntegrationsTab();
    filterByName('AWS');
    selectStatusFilter('Available');
    cy.contains('tr', 'AWS-east').should('exist');
    cy.contains('tr', 'AWS-west').should('not.exist');
    cy.contains('tr', 'GCP-main').should('not.exist');
  });

  it('paginates the integrations table', () => {
    store.rows = Array.from({ length: 51 }, (_, i) =>
      makeMockSource({
        id: i + 1,
        uuid: `20000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
        name: `page-src-${String(i + 1).padStart(2, '0')}`,
        created_timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, i)).toISOString(),
      })
    );
    visitIntegrationsTab();
    cy.contains('tr', 'page-src-51').should('exist');
    cy.contains('tr', 'page-src-02').should('exist');
    cy.contains('tr', 'page-src-01').should('not.exist');
    cy.get('[aria-label="Go to next page"]').filter(':visible').last().click();
    cy.contains('tr', 'page-src-01').should('exist');
    cy.contains('tr', 'page-src-51').should('not.exist');
  });

  it('adds an integration from the empty state', () => {
    visitIntegrationsTab({ emptyListOk: true });
    cy.contains('Get started by connecting to your Red Hat applications').should('be.visible');
    completeAddFromTile('Empty-state OCP', 'cluster-empty-1');
    cy.contains('tr', 'Empty-state OCP', { timeout: 15000 }).should('exist');
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
    completeAddFromButton('Second OCP integration', 'cluster-second-1');
    cy.contains('tr', 'Second OCP integration', { timeout: 15000 }).should('exist');
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
    cy.get('#acknowledgeDelete').check({ force: true });
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
    cy.contains('a', 'rename-original').click();
    cy.contains('h1', 'rename-original').should('be.visible');
    cy.get('button[aria-label="Actions"]').click();
    cy.contains('a', 'Rename').click();
    cy.get('.pf-v6-c-modal-box input[name="name"]').clear();
    cy.get('.pf-v6-c-modal-box input[name="name"]').type('rename-updated');
    cy.contains('.pf-v6-c-modal-box button', 'Save').click();
    cy.get('.pf-v6-c-modal-box', { timeout: 15000 }).should('not.exist');
    cy.contains('h1', 'rename-updated').should('be.visible');
    cy.get('[aria-label="Breadcrumb"]').contains('Integrations').click();
    cy.contains('tr', 'rename-updated').should('exist');
    cy.then(() => {
      void expect(store.rows.find(r => r.uuid === '60000000-0000-4000-8000-000000000007')?.name).to.eq(
        'rename-updated'
      );
    });
  });

  it('opens integration details from a deep-link URL', () => {
    store.rows = [
      makeMockSource({
        id: 9,
        uuid: '90000000-0000-4000-8000-000000000009',
        name: 'deep-link-src',
      }),
    ];
    cy.visit('/openshift/cost-management/settings/integrations/detail/90000000-0000-4000-8000-000000000009');
    cy.contains('h1', 'deep-link-src', { timeout: 30000 }).should('be.visible');
    cy.get('[aria-label="Breadcrumb"]').contains('Integrations').click();
    cy.contains('a', 'deep-link-src', { timeout: 30000 }).should('exist');
  });

  it('shows a pause failure notification', () => {
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
    visitIntegrationsTab();
    openRowActions('pause-fail-src');
    cy.contains('button', 'Pause').click();
    cy.wait('@pauseRequest');
    cy.contains('Integration pause failed').should('be.visible');
  });

  it('pauses an active integration', () => {
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
