import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { RatesTable } from './ratesTable';

jest.mock('routes/components/dataTable', () => ({
  CompoundExpandTable: (props: any) => (
    <div
      data-testid="mock-expand-table"
      data-child-rows={props.rows?.[0]?.children?.rows?.length ?? 0}
      data-rows={props.rows?.length ?? 0}
      data-cols={props.columns?.length ?? 0}
    />
  ),
}));

jest.mock('routes/settings/priceList/components/actions', () => ({
  RateActions: () => <span>actions</span>,
}));

describe('RatesTable', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const priceList = {
    meta: { count: 1, limit: 10, offset: 0 },
    rates: [
      {
        cost_type: 'Infrastructure',
        custom_name: 'CPU rate',
        description: 'Per core-hour',
        metric: {
          label_measurement: 'Core-hour',
          label_measurement_unit: 'hrs',
          name: 'cpu_core_request',
        },
        tiered_rates: [{ unit: 'USD', value: 0.42 }],
      },
    ],
  } as any;

  test('returns no rows when priceList is missing', async () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <RatesTable
            canWrite
            filterBy={{}}
            isDisabled={false}
            isLoading={false}
            onClose={jest.fn()}
            onSort={jest.fn()}
            orderBy={{ name: 'asc' }}
            priceList={null as any}
          />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '0');
    });
  });

  test('builds one compound-expand row per rate', async () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <RatesTable
            canWrite
            filterBy={{}}
            isDisabled={false}
            isLoading={false}
            onClose={jest.fn()}
            onSort={jest.fn()}
            orderBy={{ name: 'asc' }}
            priceList={priceList}
          />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-rows', '1');
      expect(Number(table.getAttribute('data-cols'))).toBeGreaterThan(0);
    });
  });

  test('expands non-GPU tag rates into tag columns', async () => {
    const store = setupStore();
    const pl = {
      meta: { count: 1, limit: 10, offset: 0 },
      rates: [
        {
          cost_type: 'Supplementary',
          description: 'Tagged',
          metric: {
            label_metric: 'Memory',
            label_measurement: 'Usage',
            name: 'memory_gb_usage_per_hour',
          },
          tag_rates: {
            tag_key: 'env',
            tag_values: [{ default: true, description: 'd1', tag_value: 'prod', unit: 'USD', value: 1.2 }],
          },
        },
      ],
    } as any;
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <RatesTable
            canWrite
            filterBy={{}}
            isDisabled={false}
            isLoading={false}
            onClose={jest.fn()}
            onSort={jest.fn()}
            orderBy={{ name: 'asc' }}
            priceList={pl}
          />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-child-rows', '1');
    });
  });

  test('expands GPU tag rates into GPU-specific columns', async () => {
    const store = setupStore();
    const pl = {
      meta: { count: 1, limit: 10, offset: 0 },
      rates: [
        {
          cost_type: 'Infrastructure',
          metric: {
            label_metric: 'GPU',
            label_measurement: 'Usage',
            name: 'gpu_cost_per_month',
          },
          tag_rates: {
            tag_key: 'vendor',
            tag_values: [{ tag_value: 'A100', value: 0.5, unit: 'USD', description: 'gpu row' }],
          },
        },
      ],
    } as any;
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <RatesTable
            canWrite
            filterBy={{}}
            isDisabled={false}
            isLoading={false}
            onClose={jest.fn()}
            onSort={jest.fn()}
            orderBy={{ name: 'asc' }}
            priceList={pl}
          />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => {
      const table = screen.getByTestId('mock-expand-table');
      expect(table).toHaveAttribute('data-child-rows', '1');
    });
  });
});
