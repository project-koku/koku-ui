import { fireEvent, render } from '@testing-library/react';
import { Rate } from 'api/rates';
import React from 'react';

import { RateTable } from './rateTable';

describe('rate-table', () => {
  // Todo: disabled until cost models is converted to react-intl
  xtest('smoke-test', () => {
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
        tag_rates: {
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
      },
    ];
    const { getByText } = render(<RateTable tiers={tiers} />);
    expect(getByText('rate 1')).toBeTruthy();
    expect(getByText('rate 2')).toBeTruthy();
    expect(getByText('grafana')).toBeTruthy();
  });
  test.skip('sort by metric & measurement', () => {
    // Todo: disabled until cost models is converted to react-intl
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const tiers: Rate[] = [
      {
        description: '',
        metric: {
          name: 'node_cost_per_month',
          metric: 'node_cost_per_month',
          source_type: 'openshift container platform',
          label_metric: 'Node',
          label_measurement: 'Currency',
          label_measurement_unit: 'node-month',
          default_cost_type: 'Supplementary',
        },
        cost_type: 'Supplementary',
        tiered_rates: [
          {
            unit: 'USD',
            value: 125.12,
            usage: {
              unit: 'USD',
            },
          },
        ],
      },
      {
        description: '',
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
            value: 5.5,
            usage: {
              unit: 'USD',
            },
          },
        ],
      },
      {
        description: '',
        metric: {
          name: 'cpu_core_request_per_hour',
          metric: 'cpu_core_request_per_hour',
          source_type: 'openshift container platform',
          default_cost_type: 'Supplementary',
          label_metric: 'CPU',
          label_measurement: 'Usage',
          label_measurement_unit: 'core-hour',
        },
        cost_type: 'Infrastructure',
        tiered_rates: [
          {
            unit: 'USD',
            value: 7.2,
            usage: {
              unit: 'USD',
            },
          },
        ],
      },
      {
        description: '',
        metric: {
          name: 'cpu_core_request_per_hour',
          metric: 'cpu_core_request_per_hour',
          source_type: 'openshift container platform',
          default_cost_type: 'Supplementary',
          label_metric: 'CPU',
          label_measurement: 'Request',
          label_measurement_unit: 'core-hour',
        },
        cost_type: 'Supplementary',
        tiered_rates: [
          {
            unit: 'USD',
            value: 124.6,
            usage: {
              unit: 'USD',
            },
          },
        ],
      },
    ];
    const { queryAllByRole, getByRole } = render(<RateTable tiers={tiers} />);
    const metrics = queryAllByRole('cell', { name: /^(CPU|Node)$/ });
    expect(metrics).toMatchSnapshot();
    fireEvent.click(getByRole('button', { name: /metric/i }));
    expect(metrics).toMatchSnapshot();
    fireEvent.click(getByRole('button', { name: /metric/i }));
    expect(metrics).toMatchSnapshot();
    fireEvent.click(getByRole('button', { name: /measurement/i }));
    expect(metrics).toMatchSnapshot();
    fireEvent.click(getByRole('button', { name: /measurement/i }));
    expect(metrics).toMatchSnapshot();
  });
});
