import { render } from '@testing-library/react';
import { Rate } from 'api/rates';
import React from 'react';

import { RateTable } from './rateTable';

describe('rate-table', () => {
  test('smoke-test', () => {
    const tiers: Rate[] = [
      {
        description: 'rate 1',
        metric: {
          name: 'cpu_core_request_per_hour',
          metric: 'cpu_core_request_per_hour',
          source_type: 'openshift container platform',
          default_cost_type: 'Supplementary',
          label_metric: 'CPU',
          label_measurement: 'Request',
          label_measurement_unit: 'core-hour',
        },
        cost_type: 'Infrastructure',
        tiered_rates: [
          {
            unit: 'USD',
            value: 130.32,
            usage: {
              unit: 'USD',
            },
          },
        ],
      },
      {
        description: 'rate 2',
        metric: {
          name: 'cpu_core_request_per_hour',
          metric: 'cpu_core_request_per_hour',
          source_type: 'openshift container platform',
          label_metric: 'CPU',
          label_measurement: 'Usage',
          label_measurement_unit: 'core-hour',
          default_cost_type: 'Supplementary',
        },
        cost_type: 'Supplementary',
        tag_rates: [
          {
            tag_key: 'openshift',
            tag_values: [
              {
                unit: 'USD',
                value: 0.43,
                tag_value: 'worker',
                description: 'default',
                default: true,
              },
              {
                unit: 'USD',
                value: 1.5,
                tag_value: 'grafana',
                description: 'grafana containers',
                default: false,
              },
            ],
          },
        ],
      },
    ];
    const { getByText } = render(<RateTable t={txt => txt} tiers={tiers} />);
    expect(getByText('rate 1')).toBeTruthy();
    expect(getByText('rate 2')).toBeTruthy();
    expect(getByText('grafana')).toBeTruthy();
  });
});
