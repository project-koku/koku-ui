import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Rate } from '@koku-ui/api/rates';
import React from 'react';

import { RateTable } from './rateTable';

describe('rate-table', () => {
  test('smoke-test', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
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
    render(<RateTable tiers={tiers} />);
    expect(screen.getByText('rate 1')).toBeTruthy();
    expect(screen.getByText('rate 2')).toBeTruthy();
    // expect(screen.queryByText('grafana')).toBeNull(); // Note: Rows are no longer dynamically rendered to support animations
    await act(async () => user.click(screen.getByRole('button', { name: 'Various' })));
    expect(screen.getByText('grafana')).toBeTruthy();
  });
  test('sort by metric & measurement', () => {
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
    render(<RateTable tiers={tiers} />);
    const metrics = screen.getAllByRole('cell', { name: /"value":"(CPU|Node)"/ });
    expect(metrics).toMatchSnapshot();
    userEvent.click(screen.getByRole('button', { name: /metric/i })).then(() => {
      expect(metrics).toMatchSnapshot();
    });
    userEvent.click(screen.getByRole('button', { name: /measurement/i })).then(() => {
      expect(metrics).toMatchSnapshot();
    });
  });
});
