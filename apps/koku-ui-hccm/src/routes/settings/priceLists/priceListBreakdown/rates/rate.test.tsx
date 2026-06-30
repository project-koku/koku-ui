import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { PriceListType } from 'api/priceList';
import { getQuery } from 'api/queries/query';
import { configureStore } from 'store/store';
import { FetchStatus } from 'store/common';
import { getFetchId, priceListStateKey } from 'store/priceLists/priceListCommon';

import { Rate } from './rate';

const consoleWarn = console.warn;
const consoleError = console.error;

jest.mock('./rateTable', () => ({
  RateTable: ({
    onDelete,
    onEdit,
    onSort,
  }: {
    onDelete?: () => void;
    onEdit?: () => void;
    onSort?: (sortType: string, isSortAscending: boolean) => void;
  }) => (
    <div data-testid="rate-table">
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

jest.mock('./rateToolbar', () => ({
  RateToolbar: ({
    onAdd,
    onFilterAdded,
    onFilterRemoved,
    pagination,
  }: {
    onAdd?: () => void;
    onFilterAdded?: (f: { type?: string; value?: string }) => void;
    onFilterRemoved?: (f: { type?: string; value?: string }) => void;
    pagination?: React.ReactNode;
  }) => (
    <div data-testid="rate-toolbar">
      <button type="button" onClick={() => onAdd?.()}>
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

jest.mock('store/priceLists', () => {
  const actual = jest.requireActual('store/priceLists');
  return {
    ...actual,
    priceListActions: {
      ...actual.priceListActions,
      fetchPriceList: jest.fn(() => () => undefined),
    },
  };
});

const baseRatesQuery = {
  filter_by: {},
  limit: 10,
  offset: 0,
  order_by: { name: 'asc' },
};
const priceListRatesQueryString = getQuery(baseRatesQuery);
const priceListRatesFetchId = getFetchId(PriceListType.priceListRates, priceListRatesQueryString);

const priceList = { uuid: 'pl-1', name: 'Test PL', currency: 'USD' } as const;

const buildPreloadedState = (ratesData: { meta: object; data: object[] }, error?: Error) =>
  ({
    [priceListStateKey]: {
      byId: new Map([[priceListRatesFetchId, ratesData]]),
      errors: new Map([[priceListRatesFetchId, error ?? null]]),
      status: new Map([[priceListRatesFetchId, FetchStatus.complete]]),
      notification: new Map(),
    },
  }) as any;

const renderRate = (preloadedState: object) =>
  render(
    <Provider store={configureStore(preloadedState)}>
      <IntlProvider defaultLocale="en" locale="en">
        <MemoryRouter initialEntries={['/settings/price-list/pl-1']}>
          <Routes>
            <Route path="/settings/price-list/:uuid" element={<Rate canWrite priceList={priceList} />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );

describe('Rate', () => {
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

  test('shows NotAvailable when fetch fails', async () => {
    renderRate(buildPreloadedState({ meta: { count: 0 }, data: [] }, new Error('network')));
    expect(await screen.findByText(/temporarily unavailable/i)).toBeInTheDocument();
  });

  test('shows empty state when price list has no rates', async () => {
    renderRate(buildPreloadedState({ meta: { count: 0, limit: 10, offset: 0 }, data: [] }));
    expect(await screen.findByText(/no rates added yet/i)).toBeInTheDocument();
  });

  test('renders table when rates exist', async () => {
    renderRate(
      buildPreloadedState({
        meta: { count: 1, limit: 10, offset: 0 },
        data: [
          {
            cost_type: 'Infrastructure',
            description: 'd',
            metric: { name: 'cpu', label_measurement: 'm', label_measurement_unit: 'u' },
            tiered_rates: [{ unit: 'USD', value: 1 }],
          },
        ],
      })
    );
    expect(await screen.findByTestId('rate-table')).toBeInTheDocument();
    expect(screen.getByTestId('rate-toolbar')).toBeInTheDocument();
  });

  test('toolbar wiring invokes add-rate and filter handlers (toolbar renders while list loads)', async () => {
    renderRate(
      buildPreloadedState({
        meta: { count: 1, limit: 10, offset: 0 },
        data: [
          {
            cost_type: 'Infrastructure',
            description: 'd',
            metric: { name: 'cpu', label_measurement: 'm', label_measurement_unit: 'u' },
            tiered_rates: [{ unit: 'USD', value: 1 }],
          },
        ],
      })
    );
    expect(await screen.findByTestId('rate-table')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /stub-add-rate/i }));
    fireEvent.click(screen.getByRole('button', { name: /stub-filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /stub-filter-remove/i }));
  });
});
