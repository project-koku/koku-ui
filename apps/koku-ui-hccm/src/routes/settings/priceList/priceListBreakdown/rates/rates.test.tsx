import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { configureStore } from 'store/store';

import { Rates } from './rates';

const consoleWarn = console.warn;

jest.mock('routes/settings/priceList/utils/hooks', () => {
  const actual = jest.requireActual('routes/settings/priceList/utils/hooks');
  return {
    ...actual,
    usePriceListUpdate: () => ({
      error: undefined,
      notification: null,
      status: require('store/common').FetchStatus.complete,
    }),
  };
});

jest.mock('./ratesTable', () => ({
  RatesTable: () => <div data-testid="rates-table" />,
}));

jest.mock('./ratesToolbar', () => ({
  RatesToolbar: () => <div data-testid="rates-toolbar" />,
}));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, fetchPriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('Rates', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('React Router Future Flag')) {
        return;
      }
      consoleWarn.call(console, msg, ...args);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    (api.fetchPriceList as jest.Mock).mockReset();
  });

  test('shows NotAvailable when fetch fails', async () => {
    (api.fetchPriceList as jest.Mock).mockRejectedValue(new Error('network'));
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-1']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<Rates canWrite />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument());
  });

  test('shows empty state when price list has no rates', async () => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 0, limit: 10, offset: 0 },
        data: [],
        rates: [],
      },
    });
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-empty']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<Rates canWrite />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/no rates are set/i)).toBeInTheDocument());
  });

  test('renders table when rates exist', async () => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 1, limit: 10, offset: 0 },
        data: [],
        rates: [
          {
            cost_type: 'Infrastructure',
            description: 'd',
            metric: { name: 'cpu', label_measurement: 'm', label_measurement_unit: 'u' },
            tiered_rates: [{ unit: 'USD', value: 1 }],
          },
        ],
      },
    });
    render(
      <Provider store={configureStore({} as any)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-rates']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<Rates canWrite />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('rates-table')).toBeInTheDocument());
    expect(screen.getByTestId('rates-toolbar')).toBeInTheDocument();
  });
});
