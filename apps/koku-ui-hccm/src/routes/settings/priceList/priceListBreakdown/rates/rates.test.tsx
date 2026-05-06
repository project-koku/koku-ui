import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { configureStore } from 'store/store';

import { Rates } from './rates';

const consoleWarn = console.warn;
const consoleError = console.error;

jest.mock('routes/settings/priceList/utils/hooks', () => {
  const actual = jest.requireActual('routes/settings/priceList/utils/hooks');
  const { FetchStatus } = require('store/common');
  return {
    ...actual,
    usePriceListUpdate: () => ({
      error: undefined,
      notification: null,
      // Rates waits to fetch until update flow is idle; `complete` blocks dispatch.
      status: FetchStatus.none,
    }),
  };
});

jest.mock('./ratesTable', () => ({
  RatesTable: ({
    onDelete,
    onEdit,
    onSort,
  }: {
    onDelete?: () => void;
    onEdit?: () => void;
    onSort?: (sortType: string, isSortAscending: boolean) => void;
  }) => (
    <div data-testid="rates-table">
      <button type="button" onClick={() => onDelete?.()}>
        stub-delete
      </button>
      <button type="button" onClick={() => onEdit?.()}>
        stub-edit
      </button>
      <button type="button" onClick={() => onSort?.('name', true)}>
        stub-sort
      </button>
    </div>
  ),
}));

jest.mock('./ratesToolbar', () => ({
  RatesToolbar: ({
    onAddRate,
    onFilterAdded,
    onFilterRemoved,
    pagination,
  }: {
    onAddRate?: () => void;
    onFilterAdded?: (f: { type?: string; value?: string }) => void;
    onFilterRemoved?: (f: { type?: string; value?: string }) => void;
    pagination?: React.ReactNode;
  }) => (
    <div data-testid="rates-toolbar">
      <button type="button" onClick={() => onAddRate?.()}>
        stub-add-rate
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'n' })}>
        stub-filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'n' })}>
        stub-filter-remove
      </button>
      {pagination}
    </div>
  ),
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
    jest.spyOn(console, 'error').mockImplementation((msg: unknown, ...args: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('not wrapped in act')) {
        return;
      }
      consoleError.call(console, msg, ...args);
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
    expect(await screen.findByText(/temporarily unavailable/i)).toBeInTheDocument();
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
    expect(await screen.findByText(/no rates are set/i)).toBeInTheDocument();
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
    expect(await screen.findByTestId('rates-table')).toBeInTheDocument();
    expect(screen.getByTestId('rates-toolbar')).toBeInTheDocument();
  });

  test('toolbar wiring invokes add-rate and filter handlers (toolbar renders while list loads)', async () => {
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
    expect(await screen.findByTestId('rates-table')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /stub-add-rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /stub-filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /stub-filter-remove/i }));
  });
});
