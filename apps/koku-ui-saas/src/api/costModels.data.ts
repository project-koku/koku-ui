export const page1 = {
  meta: {
    count: 20,
  },
  links: {
    first: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
    next: null,
    previous: null,
    last: '/api/cost-management/v1/cost-models/?limit=10&offset=10',
  },
  data: [
    {
      uuid: '0f751bde-1b44-4031-8a9a-b704dad1f4a8',
      name: 'Cost Management AWS Cost Model',
      description: 'A cost model for markup on AWS costs.',
      source_type: 'Amazon Web Services',
      created_timestamp: '2020-12-06T20:09:33.706244Z',
      updated_timestamp: '2020-12-06T20:09:33.706266Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [
        {
          uuid: '9ae025a1-2f1b-48d0-a355-6859d143bdee',
          name: 'Test AWS Source',
        },
      ],
    },
    {
      uuid: '10058b62-feb8-4caf-956b-c5947cf58eba',
      name: 'Cost Management Azure Cost Model',
      description: 'A cost model for markup on Azure costs.',
      source_type: 'Microsoft Azure',
      created_timestamp: '2020-12-06T20:09:33.769610Z',
      updated_timestamp: '2020-12-06T20:09:33.769629Z',
      rates: [],
      markup: {
        value: '20.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [
        {
          uuid: 'd4f4ff82-efe7-4f31-b93c-6143282dec70',
          name: 'Test Azure Source',
        },
      ],
    },
    {
      uuid: 'bd6dac14-0cf1-469d-b478-251cf34a3207',
      name: 'Cost Management OpenShift Cost Model',
      description: 'A cost model of on-premises OpenShift clusters.',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.553720Z',
      updated_timestamp: '2020-12-07T11:33:12.066769Z',
      rates: [
        {
          metric: {
            name: 'cpu_core_usage_per_hour',
            label_metric: 'CPU',
            label_measurement: 'Usage',
            label_measurement_unit: 'core-hours',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.007,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'cpu_core_request_per_hour',
            label_metric: 'CPU',
            label_measurement: 'Request',
            label_measurement_unit: 'core-hours',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.2,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'memory_gb_usage_per_hour',
            label_metric: 'Memory',
            label_measurement: 'Usage',
            label_measurement_unit: 'GiB-hours',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.009,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'memory_gb_request_per_hour',
            label_metric: 'Memory',
            label_measurement: 'Request',
            label_measurement_unit: 'GiB-hours',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.05,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'storage_gb_usage_per_month',
            label_metric: 'Storage',
            label_measurement: 'Usage',
            label_measurement_unit: 'GB-month',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.01,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'storage_gb_request_per_month',
            label_metric: 'Storage',
            label_measurement: 'Request',
            label_measurement_unit: 'GB-month',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 0.01,
            },
          ],
          cost_type: 'Supplementary',
        },
        {
          metric: {
            name: 'node_cost_per_month',
            label_metric: 'Node',
            label_measurement: 'Currency',
            label_measurement_unit: 'node-month',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 1000,
            },
          ],
          cost_type: 'Infrastructure',
        },
        {
          metric: {
            name: 'cluster_cost_per_month',
            label_metric: 'Cluster',
            label_measurement: 'Currency',
            label_measurement_unit: 'cluster-month',
          },
          description: '',
          tiered_rates: [
            {
              unit: 'USD',
              usage: {
                unit: 'USD',
                usage_end: null,
                usage_start: null,
              },
              value: 10000,
            },
          ],
          cost_type: 'Infrastructure',
        },
        {
          metric: {
            name: 'pvc_cost_per_month',
            label_metric: 'Persistent volume claims',
            label_measurement: 'Currency',
            label_measurement_unit: 'pvc-month',
          },
          description: '',
          tag_rates: {
            tag_key: 'key-1',
            tag_values: [
              {
                unit: 'USD',
                value: 10,
                default: false,
                tag_value: 'value-2',
                description: '',
              },
            ],
          },
          cost_type: 'Infrastructure',
        },
      ],
      markup: {
        unit: 'percent',
      },
      source_uuids: [],
      sources: [
        {
          uuid: '774b88bd-6330-449d-a169-5a8bca7f9d35',
          name: 'Test OCP on Premises',
        },
      ],
    },
    {
      uuid: 'f3c81a95-be5a-4b40-82f3-6547609b95aa',
      name: 'Cost Management OpenShift on AWS Cost Model',
      description: 'A cost model for markup on OpenShift on AWS costs.',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [
        {
          uuid: 'e93a7ff6-49f5-45fc-aa92-3b4c358217cc',
          name: 'Test OCP on AWS',
        },
      ],
    },
    {
      uuid: 'd5c81a95-be5a-8b80-82f3-6547609b95aa',
      name: 'Cost Management OpenShift on AWS Cost Model 2',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
    {
      uuid: 'eef81a95-be5a-4b40-82f3-9547609b95dd',
      name: 'Cost Management OpenShift on AWS Cost Model 3',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
    {
      uuid: 'ffffff95-be5a-4b40-82f3-9547609b95dd',
      name: 'Cost Management OpenShift on AWS Cost Model 4',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
    {
      uuid: '44444495-be5a-4b40-82f3-9547609b95dd',
      name: 'Cost Management OpenShift on AWS Cost Model 5',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
    {
      uuid: '5aaaad95-ce5a-4b40-82f3-9547609b95dd',
      name: 'Cost Management OpenShift on AWS Cost Model 6',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
    {
      uuid: '6dac7d9e-ce5a-4b40-82f3-9547609b95dd',
      name: 'Cost Management OpenShift on AWS Cost Model 7',
      description: '',
      source_type: 'OpenShift Container Platform',
      created_timestamp: '2020-12-06T20:09:33.641427Z',
      updated_timestamp: '2020-12-06T20:09:33.641461Z',
      rates: [],
      markup: {
        value: '10.0000000000',
        unit: 'percent',
      },
      source_uuids: [],
      sources: [],
    },
  ],
};

export const emptyPage = {
  meta: {
    count: 0,
  },
  links: {
    first: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
    next: null,
    previous: null,
    last: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
  },
  data: [],
};

export const noMatchPagePageNumber = {
  meta: {
    count: 0,
  },
  links: {
    first: '/api/cost-management/v1/cost-models/?limit=10&offset=20',
    next: null,
    previous: null,
    last: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
  },
  data: [],
};

export const filterByAll = {
  meta: {
    count: 0,
  },
  links: {
    first:
      '/api/cost-management/v1/cost-models/?limit=10&offset=0&name=randomName&description=randomDesc&source_type=OCP',
    next: null,
    previous: null,
    last: '/api/cost-management/v1/cost-models/?limit=10&offset=0&name=randomName&description=randomDesc&source_type=OCP',
  },
  data: [],
};

export const noMatchPageName = {
  meta: {
    count: 0,
  },
  links: {
    first: '/api/cost-management/v1/cost-models/?limit=10&offset=0&name=randomName',
    next: null,
    previous: null,
    last: '/api/cost-management/v1/cost-models/?limit=10&offset=0&name=randomName',
  },
  data: [],
};
