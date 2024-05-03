/**
 * Design doc https://docs.google.com/document/d/1b9JhMmFRvp0JL_wFkiOPzyyx72kG2_BZGjoRcyz8rq4/edit
 */

export const data = {
  meta: {
    count: 8,
    limit: 10,
    offset: 0,
    currency: 'USD',
    cost_type: 'unblended_cost',
    filter: {
      resolution: 'monthly',
      time_scope_value: '-1',
      time_scope_units: 'month',
    },
    order_by: {},
    exclude: {},
    total: {
      usage: {
        value: 1215,
        units: 'Hrs',
      },
      cost: {
        raw: {
          value: 125,
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
        total: {
          value: 896,
          units: 'USD',
        },
      },
    },
  },
  links: {
    first: '/api/v1/aws/resources/ec2-compute?limit=10&offset=0',
    next: null,
    previous: null,
    last: '/api/v1/aws/resources/ec2-compute?limit=10&offset=50',
  },
  data: [
    {
      date: '2024-04',
      resource_ids: [
        {
          resource_id: 'i-456abc',
          account: '9999999999991',
          account_alias: 'account 001',
          instance_name: 'prod-inst',
          region: 'us-east-1',
          operating_system: 'Windows Server',
          instance_type: 't2.large',
          vcpu: 4,
          memory: '32 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 120,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 75,
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
            total: {
              value: 75,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-123xyz',
          account: '9999999999993',
          account_alias: 'account 003',
          instance_name: 'dev-inst',
          region: 'us-west-2',
          operating_system: 'Ubuntu',
          instance_type: 't2.micro',
          vcpu: 3,
          memory: '16 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 100,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 50,
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
            total: {
              value: 50,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-789def',
          account: '9999999999992',
          instance_name: 'test-inst',
          region: 'eu-central-1',
          operating_system: 'Red Hat Enterprise Linux',
          instance_type: 'm5.xlarge',
          vcpu: 8,
          memory: '64 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 150,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 100,
              units: 'USD',
            },
            markup: {
              value: 10,
              units: 'USD',
            },
            usage: {
              value: 0,
              units: 'USD',
            },
            total: {
              value: 110,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-987xyz',
          account: '9999999999994',
          instance_name: 'stage-inst',
          region: 'ap-southeast-1',
          operating_system: 'Amazon Linux',
          instance_type: 'c5.2xlarge',
          vcpu: 16,
          memory: '48 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 200,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 150,
              units: 'USD',
            },
            markup: {
              value: 15,
              units: 'USD',
            },
            usage: {
              value: 0,
              units: 'USD',
            },
            total: {
              value: 165,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-0ab1cd2e',
          account: '9999999999995',
          account_alias: null,
          instance_name: 'batch-proc',
          region: 'us-east-1',
          operating_system: 'CentOS',
          instance_type: 'r4.large',
          vcpu: 4,
          memory: '30 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 90,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 60,
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
            total: {
              value: 60,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-1cd2eab3',
          account: '9999999999996',
          account_alias: null,
          instance_name: 'data-analysis',
          region: 'us-west-2',
          operating_system: 'Oracle Linux',
          instance_type: 't3.medium',
          vcpu: 2,
          memory: '8 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 75,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 40,
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
            total: {
              value: 40,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-2eab31cd',
          account: '9999999999997',
          instance_name: 'web-server',
          region: 'eu-central-1',
          operating_system: 'Debian',
          instance_type: 'm5.2xlarge',
          vcpu: 8,
          memory: '64 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['prod-inst'],
            },
            {
              key: 'environment',
              values: ['Prod'],
            },
          ],
          usage: {
            value: 300,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 250,
              units: 'USD',
            },
            markup: {
              value: 25,
              units: 'USD',
            },
            usage: {
              value: 0,
              units: 'USD',
            },
            total: {
              value: 275,
              units: 'USD',
            },
          },
        },
        {
          resource_id: 'i-3ab1cd2e',
          account: '9999999999998',
          instance_name: 'mobile-api',
          region: 'ap-northeast-1',
          operating_system: 'Fedora',
          instance_type: 'c5.large',
          vcpu: 2,
          memory: '16 GiB',
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
            },
            {
              key: 'Name',
              values: ['mobile-api'],
            },
            {
              key: 'environment',
              values: ['Dev'],
            },
          ],
          usage: {
            value: 180,
            units: 'Hrs',
          },
          cost: {
            raw: {
              value: 110,
              units: 'USD',
            },
            markup: {
              value: 11,
              units: 'USD',
            },
            usage: {
              value: 0,
              units: 'USD',
            },
            total: {
              value: 121,
              units: 'USD',
            },
          },
        },
      ],
    },
  ],
};
