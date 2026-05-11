import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

/** Used by react-router-dom mock below (Jest `mock*` hoist rule). */
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { PriceList } from './priceList';

jest.mock('routes/settings/priceList/utils', () => {
  const actual = jest.requireActual('routes/settings/priceList/utils');
  return {
    ...actual,
    usePriceListUpdate: () => ({
      error: undefined,
      notification: null,
      status: require('store/common').FetchStatus.complete,
    }),
  };
});

jest.mock('./priceListTable', () => ({
  PriceListTable: ({
    onDelete,
    onDeprecate,
    onDuplicate,
    onSort,
  }: {
    onDelete?: () => void;
    onDeprecate?: () => void;
    onDuplicate?: () => void;
    onSort?: (sortType: string, isSortAscending: boolean) => void;
  }) => (
    <div data-testid="price-list-table">
      <button type="button" onClick={() => onDelete?.()}>
        table-delete
      </button>
      <button type="button" onClick={() => onDeprecate?.()}>
        table-deprecate
      </button>
      <button type="button" onClick={() => onDuplicate?.()}>
        table-duplicate
      </button>
      <button type="button" onClick={() => onSort?.('name', true)}>
        table-sort
      </button>
    </div>
  ),
}));

jest.mock('./priceListToolbar', () => ({
  PriceListToolbar: ({
    onCreate,
    onFilterAdded,
    onFilterRemoved,
    onShowDeprecated,
    pagination,
  }: {
    onCreate?: () => void;
    onFilterAdded?: (f: { type?: string; value?: string }) => void;
    onFilterRemoved?: (f: { type?: string; value?: string }) => void;
    onShowDeprecated?: (checked: boolean) => void;
    pagination?: React.ReactNode;
  }) => (
    <div data-testid="price-list-toolbar">
      <button type="button" onClick={() => onCreate?.()}>
        toolbar-create
      </button>
      <button type="button" onClick={() => onFilterAdded?.({ type: 'name', value: 'x' })}>
        toolbar-filter-add
      </button>
      <button type="button" onClick={() => onFilterRemoved?.({ type: 'name', value: 'x' })}>
        toolbar-filter-remove
      </button>
      <button type="button" onClick={() => onShowDeprecated?.(true)}>
        toolbar-show-deprecated
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

/** Opt into React Router v7 behavior in tests to avoid future-flag console warnings. */
const routerFuture = { v7_relativeSplatPath: true, v7_startTransition: true } as const;

const consoleError = console.error;

describe('settings PriceList', () => {
  jest.useRealTimers();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  beforeAll(() => {
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

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('requests the price list on mount and records a fetch error when the API rejects', async () => {
    (api.fetchPriceList as jest.Mock).mockRejectedValue(new Error('network'));
    const store = setupStore();
    render(
      <Provider store={store}>
        <MemoryRouter future={routerFuture}>
          <IntlProvider defaultLocale="en" locale="en">
            <PriceList canWrite />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(api.fetchPriceList).toHaveBeenCalled());
    await waitFor(() => {
      const errors = (store.getState() as any).priceList?.errors;
      expect(errors && [...errors.values()].filter(Boolean).length).toBeGreaterThan(0);
    });
  });

  test('toolbar callbacks run while list fetch is in flight (toolbar is always mounted)', async () => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 1, limit: 10, offset: 0 },
        data: [{ uuid: 'pl-1', name: 'One', enabled: true }],
      },
    });
    render(
      <Provider store={setupStore()}>
        <MemoryRouter future={routerFuture}>
          <IntlProvider defaultLocale="en" locale="en">
            <PriceList canWrite />
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('price-list-toolbar')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /toolbar-create/i }));
    expect(mockNavigate).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ replace: true }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-add/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-filter-remove/i }));
    fireEvent.click(screen.getByRole('button', { name: /toolbar-show-deprecated/i }));
  });
});
