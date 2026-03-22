/**
 * Custom Cypress commands for the onprem application
 */

import { buildSourcesDataset, type MockSourceRow } from './sourcesDataset';
import { filterSortPaginateSources } from './sourcesListQuery';

// Response for user-access API
const userAccessResponse = {
  statusCode: 200,
  body: {
    meta: { count: 6 },
    links: {
      first: '/api/cost-management/v1/user-access/?limit=10&offset=0',
      next: null,
      previous: null,
      last: '/api/cost-management/v1/user-access/?limit=10&offset=0',
    },
    data: [
      { type: 'aws', access: true, write: true },
      { type: 'azure', access: true, write: true },
      { type: 'cost_model', access: true, write: true },
      { type: 'gcp', access: true, write: true },
      { type: 'ocp', access: true, write: true },
      { type: 'settings', access: true, write: true },
    ],
  },
};

// Response for sources/providers API
const sourcesResponse = {
  statusCode: 200,
  body: {
    meta: { count: 1 },
    links: {
      first: '/api/cost-management/v1/sources/?limit=10&offset=0',
      next: null,
      previous: null,
      last: '/api/cost-management/v1/sources/?limit=10&offset=0',
    },
    data: [
      {
        id: 1,
        uuid: 'd9e90e28-e102-436d-b6b3-6a9e7ad38c63',
        name: 'demo-hub',
        source_type: 'OCP',
        authentication: {
          credentials: {
            cluster_id: '0c8b80ae-7fda-47aa-af37-58eb241116d5',
          },
        },
        billing_source: {},
        provider_linked: true,
        active: true,
        paused: false,
        current_month_data: true,
        previous_month_data: true,
        last_payload_received_at: '2025-01-15T12:00:00Z',
        last_polling_time: '2025-01-15T12:00:03Z',
        status: null,
        has_data: true,
        infrastructure: {},
        cost_models: [
          {
            name: 'OCP',
            uuid: '73a3f526-e053-41a8-80af-69c6159fac30',
          },
        ],
        additional_context: {},
      },
    ],
  },
};

/**
 * Load API interceptors to mock the Cost Management API calls.
 * This is required for the federated modules to work properly.
 */
Cypress.Commands.add('loadApiInterceptors', () => {
  // Mock user-access API - provides permissions for all resource types
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/user-access/',
    },
    userAccessResponse
  ).as('getUserAccess');

  // Mock sources/providers API - returns empty list of providers
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/sources/',
    },
    sourcesResponse
  ).as('getSources');

  // Mock account-settings API
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/account-settings/',
    },
    {
      statusCode: 200,
      body: {
        data: {
          cost_type: 'calculated_amortized_cost',
          currency: 'USD',
        },
      },
    }
  ).as('getAccountSettings');

  // Mock account-settings cost-type API
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/account-settings/cost-type/',
    },
    {
      statusCode: 200,
      body: {
        data: {
          cost_type: 'calculated_amortized_cost',
        },
      },
    }
  ).as('getCostType');

  // Mock account-settings currency API
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/account-settings/currency/',
    },
    {
      statusCode: 200,
      body: {
        data: {
          currency: 'USD',
        },
      },
    }
  ).as('getCurrency');

  // Mock reports APIs (for Overview page data)
  // Using a simple structure with just meta.total for cost display
  // Empty data array prevents tab rendering errors while still showing costs
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/reports\/.*/,
    },
    {
      statusCode: 200,
      body: {
        meta: {
          count: 0,
          delta: { value: 1250.75, percent: 15 },
          filter: {},
          group_by: {},
          order_by: {},
          total: {
            cost: {
              total: { value: 12547.89, units: 'USD' },
              raw: { value: 11200.0, units: 'USD' },
              markup: { value: 1347.89, units: 'USD' },
              usage: { value: 8500.0, units: 'USD' },
            },
            infrastructure: {
              total: { value: 8500.0, units: 'USD' },
              raw: { value: 7500.0, units: 'USD' },
              markup: { value: 1000.0, units: 'USD' },
              usage: { value: 6000.0, units: 'USD' },
            },
            supplementary: {
              total: { value: 4047.89, units: 'USD' },
              raw: { value: 3700.0, units: 'USD' },
              markup: { value: 347.89, units: 'USD' },
              usage: { value: 2500.0, units: 'USD' },
            },
          },
        },
        links: { first: null, next: null, previous: null, last: null },
        data: [],
      },
    }
  ).as('getReports');

  // Mock forecasts APIs
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/forecasts\/.*/,
    },
    {
      statusCode: 200,
      body: {
        meta: { count: 0 },
        links: { first: null, next: null, previous: null, last: null },
        data: [],
      },
    }
  ).as('getForecasts');

  // Mock resource-types API
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/resource-types\/.*/,
    },
    {
      statusCode: 200,
      body: {
        meta: { count: 0 },
        links: { first: null, next: null, previous: null, last: null },
        data: [],
      },
    }
  ).as('getResourceTypes');

  // Mock tags APIs
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/tags\/.*/,
    },
    {
      statusCode: 200,
      body: {
        meta: { count: 0 },
        links: { first: null, next: null, previous: null, last: null },
        data: [],
      },
    }
  ).as('getTags');

  // Mock ROS (Resource Optimization Service) APIs for Optimizations page
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/recommendations\/.*/,
    },
    {
      statusCode: 200,
      body: {
        meta: { count: 2, limit: 10, offset: 0 },
        links: { first: null, next: null, previous: null, last: null },
        data: [
          {
            cluster_alias: 'demo-hub',
            cluster_uuid: 'd9e90e28-e102-436d-b6b3-6a9e7ad38c63',
            container: 'api-server',
            id: '3b55b8f2-fad9-48a7-9598-6ea3a0675546',
            last_reported: '2025-01-15T12:00:00Z',
            project: 'demo-project',
            workload: 'api-deployment',
            workload_type: 'Deployment',
            recommendations: {
              notifications: {
                '111101': {
                  code: 111101,
                  message: 'Short Term Recommendations Available',
                  type: 'info',
                },
              },
              monitoring_end_time: '2025-01-15T00:00:00.000Z',
              current: {
                requests: {
                  memory: { amount: 512, format: 'MiB' },
                  cpu: { amount: 0.5, format: 'cores' },
                },
                limits: {
                  memory: { amount: 1024, format: 'MiB' },
                  cpu: { amount: 1.0, format: 'cores' },
                },
              },
              recommendation_terms: {
                short_term: {
                  duration_in_hours: 24.0,
                  monitoring_start_time: '2025-01-14T00:00:00.000Z',
                  recommendation_engines: {
                    cost: {
                      pods_count: 3,
                      confidence_level: 0.95,
                      config: {
                        requests: {
                          memory: { amount: 256, format: 'MiB' },
                          cpu: { amount: 0.25, format: 'cores' },
                        },
                        limits: {
                          memory: { amount: 512, format: 'MiB' },
                          cpu: { amount: 0.5, format: 'cores' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            cluster_alias: 'demo-hub',
            cluster_uuid: 'd9e90e28-e102-436d-b6b3-6a9e7ad38c63',
            container: 'worker',
            id: '4c66c9f3-gbe0-59b8-0699-7fb4b1786657',
            last_reported: '2025-01-15T12:00:00Z',
            project: 'demo-project',
            workload: 'worker-deployment',
            workload_type: 'Deployment',
            recommendations: {
              notifications: {
                '111101': {
                  code: 111101,
                  message: 'Short Term Recommendations Available',
                  type: 'info',
                },
              },
              monitoring_end_time: '2025-01-15T00:00:00.000Z',
              current: {
                requests: {
                  memory: { amount: 1024, format: 'MiB' },
                  cpu: { amount: 1.0, format: 'cores' },
                },
                limits: {
                  memory: { amount: 2048, format: 'MiB' },
                  cpu: { amount: 2.0, format: 'cores' },
                },
              },
              recommendation_terms: {
                short_term: {
                  duration_in_hours: 24.0,
                  monitoring_start_time: '2025-01-14T00:00:00.000Z',
                  recommendation_engines: {
                    cost: {
                      pods_count: 5,
                      confidence_level: 0.9,
                      config: {
                        requests: {
                          memory: { amount: 512, format: 'MiB' },
                          cpu: { amount: 0.5, format: 'cores' },
                        },
                        limits: {
                          memory: { amount: 1024, format: 'MiB' },
                          cpu: { amount: 1.0, format: 'cores' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }
  ).as('getRecommendations');

  // Mock feature flags API
  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/featureflags\/.*/,
    },
    {
      statusCode: 200,
      body: {
        toggles: [],
      },
    }
  ).as('getFeatureFlags');
});

/**
 * Override the sources API interceptor to return an empty list.
 */
Cypress.Commands.add('interceptSourcesEmpty', () => {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/sources/',
    },
    {
      statusCode: 200,
      body: {
        meta: { count: 0 },
        links: { first: null, next: null, previous: null, last: null },
        data: [],
      },
    }
  ).as('getSourcesEmpty');
});

/**
 * Override the sources API interceptor with full CRUD support.
 */
Cypress.Commands.add('interceptSourcesCRUD', () => {
  const mockSources = [
    {
      id: 1,
      uuid: '11111111-1111-1111-1111-111111111111',
      name: 'My OpenShift Cluster',
      source_type: 'OCP',
      authentication: { credentials: { cluster_id: 'test-cluster-001' } },
      billing_source: null,
      provider_linked: true,
      active: true,
      paused: false,
      current_month_data: true,
      previous_month_data: true,
      has_data: true,
      created_timestamp: '2026-01-15T10:30:00Z',
    },
    {
      id: 2,
      uuid: '22222222-2222-2222-2222-222222222222',
      name: 'AWS Production Account',
      source_type: 'AWS',
      authentication: { credentials: { role_arn: 'arn:aws:iam::123456789012:role/CostManagement' } },
      billing_source: { data_source: { bucket: 'my-cost-bucket', region: 'us-east-1' } },
      provider_linked: true,
      active: true,
      paused: false,
      current_month_data: true,
      previous_month_data: false,
      has_data: true,
      created_timestamp: '2026-02-20T14:15:00Z',
    },
  ];

  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/sources/',
    },
    req => {
      const { data, meta } = filterSortPaginateSources(mockSources as MockSourceRow[], req.url);
      req.reply({
        statusCode: 200,
        body: {
          meta: { count: meta.count },
          links: { first: null, next: null, previous: null, last: null },
          data,
        },
      });
    }
  ).as('getSourcesList');

  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    req => {
      const uuid = req.url.split('/sources/')[1].replace(/\/$/, '');
      const source = mockSources.find(s => s.uuid === uuid);
      req.reply(source ? { statusCode: 200, body: source } : { statusCode: 404 });
    }
  ).as('getSourceDetail');

  cy.intercept(
    {
      method: 'POST',
      pathname: '/api/cost-management/v1/sources/',
    },
    req => {
      req.reply({
        statusCode: 201,
        body: {
          id: 99,
          uuid: '99999999-9999-9999-9999-999999999999',
          name: req.body.name,
          source_type: req.body.source_type,
          authentication: {},
          billing_source: null,
          provider_linked: false,
          active: false,
          paused: false,
          current_month_data: false,
          previous_month_data: false,
          has_data: false,
          created_timestamp: new Date().toISOString(),
        },
      });
    }
  ).as('createSource');

  cy.intercept(
    {
      method: 'POST',
      pathname: '/api/cost-management/v1/applications',
    },
    {
      statusCode: 201,
      body: { id: 99, source_id: 99, application_type_id: 0, extra: {} },
    }
  ).as('createApplication');

  cy.intercept(
    {
      method: 'PATCH',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    req => {
      const uuid = req.url.split('/sources/')[1].replace(/\/$/, '');
      const idx = mockSources.findIndex(s => s.uuid === uuid);
      if (idx === -1) {
        req.reply({ statusCode: 404 });
        return;
      }
      mockSources[idx] = { ...mockSources[idx], ...req.body } as (typeof mockSources)[0];
      req.reply({
        statusCode: 200,
        body: mockSources[idx],
      });
    }
  ).as('updateSource');

  cy.intercept(
    {
      method: 'DELETE',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    { statusCode: 204, body: '' }
  ).as('deleteSource');
});

/**
 * Large deterministic sources list for pagination, name search, and detail navigation (no real API).
 */
Cypress.Commands.add('interceptSourcesWithDataset', (options?: { total?: number }) => {
  const total = options?.total ?? 47;
  const mutableSources: MockSourceRow[] = buildSourcesDataset(total);

  cy.intercept(
    {
      method: 'GET',
      pathname: '/api/cost-management/v1/sources/',
    },
    req => {
      const { data, meta } = filterSortPaginateSources(mutableSources, req.url);
      req.reply({
        statusCode: 200,
        body: {
          meta: { count: meta.count },
          links: { first: null, next: null, previous: null, last: null },
          data,
        },
      });
    }
  ).as('getSourcesList');

  cy.intercept(
    {
      method: 'GET',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    req => {
      const uuid = req.url.split('/sources/')[1].replace(/\/$/, '');
      const source = mutableSources.find(s => s.uuid === uuid);
      req.reply(source ? { statusCode: 200, body: source } : { statusCode: 404 });
    }
  ).as('getSourceDetail');

  cy.intercept(
    {
      method: 'POST',
      pathname: '/api/cost-management/v1/sources/',
    },
    req => {
      const body = req.body as { name?: string; source_type?: string };
      const nextId = mutableSources.reduce((m, s) => Math.max(m, s.id), 0) + 1;
      const hex12 = nextId.toString(16).padStart(12, '0');
      const created: MockSourceRow = {
        id: nextId,
        uuid: `99999999-9999-9999-9999-${hex12}`,
        name: String(body.name ?? 'New'),
        source_type: (body.source_type as MockSourceRow['source_type']) ?? 'OCP',
        authentication: { credentials: {} },
        billing_source: null,
        provider_linked: false,
        active: false,
        paused: false,
        current_month_data: false,
        previous_month_data: false,
        has_data: false,
        created_timestamp: new Date().toISOString(),
      };
      mutableSources.push(created);
      req.reply({ statusCode: 201, body: created });
    }
  ).as('createSource');

  cy.intercept(
    {
      method: 'POST',
      pathname: '/api/cost-management/v1/applications',
    },
    {
      statusCode: 201,
      body: { id: 99, source_id: 99, application_type_id: 0, extra: {} },
    }
  ).as('createApplication');

  cy.intercept(
    {
      method: 'PATCH',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    req => {
      const uuid = req.url.split('/sources/')[1].replace(/\/$/, '');
      const idx = mutableSources.findIndex(s => s.uuid === uuid);
      if (idx === -1) {
        req.reply({ statusCode: 404 });
        return;
      }
      const body = req.body as Record<string, unknown>;
      mutableSources[idx] = { ...mutableSources[idx], ...body } as MockSourceRow;
      req.reply({
        statusCode: 200,
        body: mutableSources[idx],
      });
    }
  ).as('updateSource');

  cy.intercept(
    {
      method: 'DELETE',
      pathname: /^\/api\/cost-management\/v1\/sources\/[^/]+\/$/,
    },
    req => {
      const uuid = req.url.split('/sources/')[1].replace(/\/$/, '');
      const idx = mutableSources.findIndex(s => s.uuid === uuid);
      if (idx >= 0) {
        mutableSources.splice(idx, 1);
      }
      req.reply({ statusCode: 204, body: '' });
    }
  ).as('deleteSource');
});

/**
 * Wait for the federated module to load and render.
 * This ensures the Scalprum component has finished loading the remote module.
 */
Cypress.Commands.add('waitForFederatedModule', () => {
  // Wait for the page content to be visible (not loading state)
  cy.get('#primary-app-container', { timeout: 15000 }).should('be.visible');
  // Wait for any loading spinners to disappear
  cy.get('.pf-v6-c-spinner', { timeout: 15000 }).should('not.exist');
});
