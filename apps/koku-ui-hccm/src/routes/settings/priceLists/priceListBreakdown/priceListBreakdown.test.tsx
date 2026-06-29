import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { PriceListType } from 'api/priceList';
import { getQuery } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccessType } from 'api/userAccess';
import { configureStore } from 'store/store';
import { FetchStatus } from 'store/common';
import { getFetchId, priceListStateKey } from 'store/priceLists/priceListCommon';
import { userAccessQuery, userAccessStateKey } from 'store/userAccess';
import { getFetchId as getUserAccessFetchId } from 'store/userAccess/userAccessCommon';

import PriceListBreakdown from './priceListBreakdown';

jest.mock('./priceListBreakdownHeader', () => ({
  PriceListBreakdownHeader: () => <div data-testid="breakdown-header" />,
}));

jest.mock('./rates', () => ({
  Rate: ({ canWrite }: { canWrite?: boolean }) => (
    <div data-testid="rates-panel">{canWrite ? 'write' : 'read'}</div>
  ),
}));

jest.mock('./costModels', () => ({
  CostModels: () => <div data-testid="cost-models-panel" />,
}));

jest.mock('routes/settings/priceLists/utils', () => {
  const actual = jest.requireActual('routes/settings/priceLists/utils');
  return {
    ...actual,
    usePriceListUpdate: () => ({
      error: undefined,
      notification: null,
      status: require('store/common').FetchStatus.complete,
    }),
  };
});

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

const consoleWarn = console.warn;

const priceListQueryString = getQuery({ filter_by: {} });
const priceListFetchId = getFetchId(PriceListType.priceList, priceListQueryString);
const userAccessQueryString = getUserAccessQuery(userAccessQuery);
const userAccessFetchId = getUserAccessFetchId(UserAccessType.all, userAccessQueryString);

const buildPreloadedState = () =>
  ({
    [userAccessStateKey]: {
      byId: new Map([
        [
          userAccessFetchId,
          {
            data: [{ type: UserAccessType.costModel, access: true, write: true }],
          },
        ],
      ]),
      errors: new Map([[userAccessFetchId, null]]),
      fetchStatus: new Map([[userAccessFetchId, FetchStatus.complete]]),
    },
    [priceListStateKey]: {
      byId: new Map([
        [
          priceListFetchId,
          {
            meta: { count: 1 },
            data: [{ name: 'PL', uuid: 'u1' }],
            rates: [{ metric: { name: 'cpu' } }],
            assigned_cost_model_count: 1,
          },
        ],
      ]),
      errors: new Map([[priceListFetchId, null]]),
      status: new Map([[priceListFetchId, FetchStatus.complete]]),
      notification: new Map(),
    },
  }) as any;

describe('priceListBreakdown', () => {
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

  test('renders rates tab by default and switches to cost models tab', async () => {
    render(
      <Provider store={configureStore(buildPreloadedState())}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-1']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<PriceListBreakdown />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByTestId('rates-panel')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('tab', { name: /assigned cost models/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('tab', { name: /assigned cost models/i }));

    await waitFor(() => expect(screen.getByTestId('cost-models-panel')).toBeInTheDocument());
    expect(screen.queryByTestId('rates-panel')).not.toBeInTheDocument();
  });

  test('shows unavailable state when price list fetch fails', async () => {
    const state = buildPreloadedState();
    state[priceListStateKey].errors.set(priceListFetchId, new Error('err') as any);

    render(
      <Provider store={configureStore(state)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-bad']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<PriceListBreakdown />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument());
  });
});
