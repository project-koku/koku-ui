/**
 * Custom Cypress commands for the onprem application
 */

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
 * Wait for the federated module to load and render.
 * This ensures the Scalprum component has finished loading the remote module.
 */
Cypress.Commands.add('waitForFederatedModule', () => {
  // Wait for the page content to be visible (not loading state)
  cy.get('#primary-app-container', { timeout: 15000 }).should('be.visible');
  // Wait for any loading spinners to disappear
  cy.get('.pf-v6-c-spinner', { timeout: 15000 }).should('not.exist');
});
