const transformReportProps = {
  report: {
    meta: {
      count: 19,
      filter: {
        resolution: 'daily',
        time_scope_value: '-1',
        time_scope_units: 'month',
      },
      group_by: {
        project: ['openshift'],
      },
      order_by: {},
      total: {
        usage: {
          value: 744.70618,
          units: 'Core-Hours',
        },
        request: {
          value: 1439,
          units: 'Core-Hours',
        },
        limit: {
          value: 1439,
          units: 'Core-Hours',
        },
        capacity: {
          value: 20992,
          units: 'Core-Hours',
        },
        infrastructure: {
          raw: {
            value: 24.91035060725161,
            units: 'USD',
          },
          markup: {
            value: 0,
            units: 'USD',
          },
          usage: {
            value: 2167.21935,
            units: 'USD',
          },
          distributed: {
            value: 0,
            units: 'USD',
          },
          total: {
            value: 2192.129700607252,
            units: 'USD',
          },
        },
        supplementary: {
          raw: {
            value: 0,
            units: 'USD',
          },
          markup: {
            value: 0,
            units: 'USD',
          },
          usage: {
            value: 340,
            units: 'USD',
          },
          distributed: {
            value: 0,
            units: 'USD',
          },
          total: {
            value: 340,
            units: 'USD',
          },
        },
        cost: {
          raw: {
            value: 24.91035060725161,
            units: 'USD',
          },
          markup: {
            value: 0,
            units: 'USD',
          },
          usage: {
            value: 2507.21935,
            units: 'USD',
          },
          distributed: {
            value: 0,
            units: 'USD',
          },
          total: {
            value: 2532.129700607252,
            units: 'USD',
          },
        },
      },
    },
    links: {
      first:
        '/api/cost-management/v1/reports/openshift/compute/?filter%5Bresolution%5D=daily&filter%5Btime_scope_units%5D=month&filter%5Btime_scope_value%5D=-1&group_by%5Bproject%5D=openshift&limit=100&offset=0',
      next: null,
      previous: null,
      last: '/api/cost-management/v1/reports/openshift/compute/?filter%5Bresolution%5D=daily&filter%5Btime_scope_units%5D=month&filter%5Btime_scope_value%5D=-1&group_by%5Bproject%5D=openshift&limit=100&offset=0',
    },
    data: [
      {
        date: '2022-05-01',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-01',
                project: 'openshift',
                usage: {
                  value: 15.10149,
                  units: 'Core-Hours',
                },
                request: {
                  value: 27,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 27,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 396,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0.466156720219827,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46.11105,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46.57720672021983,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0.466156720219827,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46.11105,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46.57720672021983,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-02',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-02',
                project: 'openshift',
                usage: {
                  value: 38.6597,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.231366497711548,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.07071649771154,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.231366497711548,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.07071649771154,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-03',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-03',
                project: 'openshift',
                usage: {
                  value: 36.15906,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.246410586751013,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08576058675101,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.246410586751013,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08576058675101,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-04',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-04',
                project: 'openshift',
                usage: {
                  value: 36.88654,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.245743757042369,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08509375704237,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.245743757042369,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08509375704237,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-05',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-05',
                project: 'openshift',
                usage: {
                  value: 33.0134,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.228287578702509,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.0676375787025,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.228287578702509,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.0676375787025,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-06',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-06',
                project: 'openshift',
                usage: {
                  value: 36.88834,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.249949508937585,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08929950893759,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.249949508937585,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08929950893759,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-07',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-07',
                project: 'openshift',
                usage: {
                  value: 38.12726,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.248057270571008,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.087407270571,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.248057270571008,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.087407270571,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-08',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-08',
                project: 'openshift',
                usage: {
                  value: 34.61801,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.243948747383553,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08329874738355,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.243948747383553,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08329874738355,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-09',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-09',
                project: 'openshift',
                usage: {
                  value: 36.11772,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.242204479762298,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.0815544797623,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.242204479762298,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.0815544797623,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-10',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-10',
                project: 'openshift',
                usage: {
                  value: 37.92386,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.241905287333484,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08125528733349,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.241905287333484,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.08125528733349,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-11',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-11',
                project: 'openshift',
                usage: {
                  value: 37.518409999999996,
                  units: 'Core-Hours',
                },
                request: {
                  value: 69,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 69,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1012,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 1.227472556169746,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.06682255616974,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 0,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 0,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 1.227472556169746,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 119.06682255616974,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-12',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-12',
                project: 'openshift',
                usage: {
                  value: 38.28517,
                  units: 'Core-Hours',
                },
                request: {
                  value: 78,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 78,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1138,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 12.038847616666667,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 129.87819761666665,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 18,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 18,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 12.038847616666667,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 135.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 147.87819761666665,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-13',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-13',
                project: 'openshift',
                usage: {
                  value: 45.83435,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-14',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-14',
                project: 'openshift',
                usage: {
                  value: 48.32058,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-15',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-15',
                project: 'openshift',
                usage: {
                  value: 44.50906,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-16',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-16',
                project: 'openshift',
                usage: {
                  value: 45.81032,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-17',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-17',
                project: 'openshift',
                usage: {
                  value: 47.36806,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-18',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-18',
                project: 'openshift',
                usage: {
                  value: 45.16964,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        date: '2022-05-19',
        projects: [
          {
            project: 'openshift',
            values: [
              {
                date: '2022-05-19',
                project: 'openshift',
                usage: {
                  value: 48.39521,
                  units: 'Core-Hours',
                },
                request: {
                  value: 92,
                  units: 'Core-Hours',
                },
                limit: {
                  value: 92,
                  units: 'Core-Hours',
                },
                capacity: {
                  value: 1334,
                  units: 'Core-Hours',
                },
                clusters: [
                  'OpenShift on AWS - Nise Populator',
                  'OpenShift on Azure - Nise Populator',
                  'OpenShift on GCP - Nise Populator',
                  'OpenShift on OpenStack - Nise Populator',
                ],
                source_uuid: [
                  '1899fc34-7096-47d6-82d8-e371268530b1',
                  '7b2cf7da-d494-4f4d-b640-f9fa57a0fe1c',
                  'a99443de-af6d-4b4b-a1d9-fdeea529606d',
                  'ae7cd5c5-b6b8-4059-966d-0548287cb609',
                ],
                infrastructure: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 117.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 117.83935,
                    units: 'USD',
                  },
                },
                supplementary: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 46,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 46,
                    units: 'USD',
                  },
                },
                cost: {
                  raw: {
                    value: 0,
                    units: 'USD',
                  },
                  markup: {
                    value: 0,
                    units: 'USD',
                  },
                  usage: {
                    value: 163.83935,
                    units: 'USD',
                  },
                  distributed: {
                    value: 0,
                    units: 'USD',
                  },
                  total: {
                    value: 163.83935,
                    units: 'USD',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
    timeRequested: 1652977478584,
  },
  type: 1,
  idKey: 'date',
  reportItem: 'request',
  reportItemValue: 'total',
};

export { transformReportProps };
