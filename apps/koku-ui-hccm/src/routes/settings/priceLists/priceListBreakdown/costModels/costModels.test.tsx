import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import { getQuery } from 'api/queries/query';
import { configureStore } from 'store/store';
import { FetchStatus } from 'store/common';
import { getFetchId, priceListStateKey } from 'store/priceLists/priceListCommon';

import { CostModels } from './costModels';

jest.mock('./costModelsTable', () => ({
  CostModelsTable: () => <div data-testid="cost-models-table" />,
}));

jest.mock('./costModelsToolbar', () => ({
  CostModelsToolbar: () => <div data-testid="cost-models-toolbar" />,
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

const consoleWarn = console.warn;

const priceListQueryString = getQuery({});
const priceListFetchId = getFetchId(PriceListType.priceList, priceListQueryString);

const buildPreloadedState = (priceListData: Partial<PriceListData>, error?: Error) =>
  ({
    [priceListStateKey]: {
      byId: new Map([[priceListFetchId, priceListData]]),
      errors: new Map([[priceListFetchId, error ?? null]]),
      status: new Map([[priceListFetchId, FetchStatus.complete]]),
      notification: new Map(),
    },
  }) as any;

describe('CostModels', () => {
  const renderView = (preloadedState: object) =>
    render(
      <Provider store={configureStore(preloadedState)}>
        <IntlProvider defaultLocale="en" locale="en">
          <MemoryRouter initialEntries={['/settings/price-list/pl-cm']}>
            <Routes>
              <Route path="/settings/price-list/:uuid" element={<CostModels />} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    );

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

  test('shows NotAvailable when fetch fails', async () => {
    renderView(buildPreloadedState({}, new Error('network')));
    await waitFor(() => expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument());
  });

  test('shows empty state when no cost models assigned', async () => {
    renderView(buildPreloadedState({ assigned_cost_models: [], meta: { count: 0 } }));
    await waitFor(() => expect(screen.getByRole('button', { name: /go to cost models/i })).toBeInTheDocument());
  });

  test('shows table when cost models are assigned', async () => {
    renderView(
      buildPreloadedState({
        assigned_cost_models: [
          { name: 'Cost model A', uuid: 'cm-a' },
          { name: 'Cost model B', uuid: 'cm-b' },
        ],
        meta: { count: 2 },
      })
    );
    await waitFor(() => expect(screen.getByTestId('cost-models-table')).toBeInTheDocument());
    expect(screen.getByTestId('cost-models-toolbar')).toBeInTheDocument();
  });
});
