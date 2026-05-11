import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { configureStore } from 'store/store';

import { PriceListRates } from './priceListRates';

jest.mock('routes/settings/priceList/priceListBreakdown/rates', () => ({
  RatesTable: (props: { rates?: { custom_name?: string }[] }) => (
    <div data-testid="rates-table-stub" data-rows={props.rates?.length ?? 0}>
      {(props.rates ?? []).map(r => (
        <span key={r.custom_name}>{r.custom_name}</span>
      ))}
    </div>
  ),
  RatesToolbar: (props: { pagination?: React.ReactNode }) => (
    <div data-testid="rates-toolbar-stub">
      <button type="button">Add rate</button>
      {props.pagination}
    </div>
  ),
}));

jest.mock('routes/settings/priceList/priceListBreakdown/rates/components/add', () => ({
  AddRate: () => <button type="button">Add rate</button>,
}));

jest.mock('store/metrics', () => {
  const actual = jest.requireActual('store/metrics');
  const { FetchStatus } = require('store/common');
  const stableByName = {
    cpu_core_request: {
      label_metric: 'CPU_Request',
      label_measurement: 'Core-hour',
      label_measurement_unit: 'hrs',
      metric: 'cpu_core_request',
      name: 'cpu_core_request',
    },
  };
  const stableMetrics = {};
  return {
    ...actual,
    metricsSelectors: {
      ...actual.metricsSelectors,
      metrics: () => stableMetrics,
      metricsByName: () => stableByName,
      status: () => FetchStatus.complete,
    },
  };
});

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

describe('PriceListRates', () => {
  const store = configureStore({} as any);

  const wrap = (ui: React.ReactElement) => (
    <MemoryRouter future={routerFuture}>
      <Provider store={store}>{ui}</Provider>
    </MemoryRouter>
  );

  const tieredRate = {
    cost_type: 'Infrastructure',
    custom_name: 'Row One',
    description: 'd',
    metric: { name: 'cpu_core_request', label_measurement: 'm', label_measurement_unit: 'u' },
    tiered_rates: [{ unit: 'USD', value: 1 }],
  };

  test('shows empty state when there are no rates and no filters', () => {
    render(
      wrap(
        <IntlProvider defaultLocale="en" locale="en">
          <PriceListRates canWrite priceList={{ currency: 'USD', rates: [], uuid: 'pl-new' } as any} />
        </IntlProvider>
      )
    );
    expect(screen.getByText(/no rates added yet/i)).toBeInTheDocument();
  });

  test('renders table card when rates exist', async () => {
    render(
      wrap(
        <IntlProvider defaultLocale="en" locale="en">
          <PriceListRates
            canWrite
            onAdd={jest.fn()}
            priceList={{ currency: 'USD', rates: [tieredRate as any], uuid: 'pl-new' } as any}
          />
        </IntlProvider>
      )
    );
    expect(await screen.findByRole('button', { name: /^add rate$/i })).toBeInTheDocument();
    const stub = screen.getByTestId('rates-table-stub');
    expect(stub).toHaveAttribute('data-rows', '1');
    expect(stub).toHaveTextContent('Row One');
  });

  test('changing page shows next slice of rates (client-side)', async () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      ...tieredRate,
      custom_name: `Rate ${i}`,
    }));
    render(
      wrap(
        <IntlProvider defaultLocale="en" locale="en">
          <PriceListRates canWrite priceList={{ currency: 'USD', rates: many as any[], uuid: 'pl' } as any} />
        </IntlProvider>
      )
    );
    expect(await screen.findByRole('button', { name: /^add rate$/i })).toBeInTheDocument();
    const stub = screen.getByTestId('rates-table-stub');
    expect(stub).toHaveAttribute('data-rows', '10');
    expect(stub).toHaveTextContent('Rate 0');
    const nextButtons = screen.getAllByRole('button', { name: /go to next page/i });
    fireEvent.click(nextButtons[0]);
    expect(stub).toHaveAttribute('data-rows', '2');
    expect(stub).toHaveTextContent('Rate 10');
  });
});
