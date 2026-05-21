import { render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { PriceListContent, type PriceListContentHandle } from './priceListContent';

jest.mock('./charts', () => ({
  TimelineChart: () => <div data-testid="timeline-chart" />,
}));

jest.mock('./priceListContentTable', () => ({
  PriceListContentTable: () => <div data-testid="content-table" />,
}));

jest.mock('./priceListContentToolbar', () => ({
  PriceListContentToolbar: () => <div data-testid="content-toolbar" />,
}));

jest.mock('routes/settings/priceList/utils', () => ({
  usePriceListUpdate: () => ({
    error: undefined,
    notification: null,
    status: require('store/common').FetchStatus.complete,
  }),
}));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { ...actual, fetchPriceList: jest.fn() };
});

import * as api from 'api/priceList';

const costModel = {
  uuid: 'cm-1',
  name: 'Model',
  currency: 'USD',
  price_lists: [{ uuid: 'pl-1', name: 'List 1', priority: 1 }],
} as any;

describe('PriceListContent', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  beforeEach(() => {
    (api.fetchPriceList as jest.Mock).mockResolvedValue({
      data: {
        meta: { count: 2, limit: 5, offset: 0 },
        data: [
          { uuid: 'pl-1', name: 'List 1', currency: 'USD' },
          { uuid: 'pl-2', name: 'List 2', currency: 'USD' },
        ],
      },
    });
  });

  test('renders toolbar and table after fetch', async () => {
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <PriceListContent canWrite costModel={costModel} onAdd={jest.fn()} onDisabled={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(api.fetchPriceList).toHaveBeenCalled());
    expect(screen.getByTestId('content-toolbar')).toBeInTheDocument();
  });

  test('save ref invokes onAdd when selection dirty', async () => {
    const onAdd = jest.fn();
    const ref = createRef<PriceListContentHandle>();
    render(
      <Provider store={setupStore()}>
        <IntlProvider locale="en">
          <PriceListContent canWrite costModel={costModel} onAdd={onAdd} onDisabled={jest.fn()} ref={ref} />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(api.fetchPriceList).toHaveBeenCalled());
    ref.current?.save();
  });
});
