/**
 * Design doc https://docs.google.com/document/d/1b9JhMmFRvp0JL_wFkiOPzyyx72kG2_BZGjoRcyz8rq4/edit
 */

export const data = {
  meta: {
    count: 2,
  } as any,
  links: {
    // usual links info
  } as any,
  data: [
    {
      date: '2024-04',
      resource_ids: [
        {
          account: 'example_account',
          account_alias: 'Example Account',
          // cost: 50.0,
          // currency: 'USD',
          cost: {
            value: 50.0,
            units: 'USD',
          },
          instance_name: 'example-instance-1',
          instance_type: 't2.micro',
          // memory: 1,
          memory: {
            value: 8,
            units: 'gib_hours',
          },
          operating_system: 'Linux',
          region: 'us-west-2',
          resource_id: 'i-1234567890abcdef0',
          // tags: {
          //   Environment: 'Production',
          //   Project: 'XYZ Project',
          // },
          tags: [
            {
              key: 'app',
              values: ['Antennae', 'master', 'season'],
              enabled: true,
            },
          ],
          // unit: 'Hrs',
          // usage_amount: 100,
          usage: {
            value: 100,
            units: 'Hrs',
          },
          vcpu: {
            value: 1,
            units: 'core_hours',
          },
        },
        {
          // cost: 150.0,
          // currency: 'USD',
          cost: {
            value: 100.0,
            units: 'USD',
          },
          account: 'another_account',
          account_alias: 'Another Account',
          instance_name: 'example-instance-2',
          instance_type: 'm5.large',
          // memory: 8,
          memory: {
            value: 8,
            units: 'gib_hours',
          },
          operating_system: 'Windows',
          region: 'us-east-1',
          resource_id: 'i-0987654321fedcba0',
          // tags: {
          //   Environment: 'Development',
          //   Project: 'ABC Project',
          // },
          tags: [
            {
              key: 'version',
              values: ['Antennae', 'master', 'orange'],
              enabled: true,
            },
          ],
          // unit: 'Hrs',
          // usage_hours: 200,
          usage: {
            value: 200,
            units: 'Hrs',
          },
          vcpu: {
            value: 2,
            units: 'core_hours',
          },
        },
      ],
    },
  ],
};
