import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { PriceListDetails } from './priceListDetails';

jest.mock('./priceListDetailsTable', () => ({
  PriceListDetailsTable: () => <div data-testid="price-list-table">price-list-table</div>,
}));

jest.mock('./priceListDetailsToolbar', () => ({
  PriceListDetailsToolbar: () => <div data-testid="price-list-toolbar">price-list-toolbar</div>,
}));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, fetchPriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('settings PriceListDetails', () => {
  jest.useRealTimers();

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('requests the price list on mount and records a fetch error when the API rejects', async () => {
    (api.fetchPriceList as jest.Mock).mockRejectedValue(new Error('network'));
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <PriceListDetails canWrite />
        </IntlProvider>
      </Provider>
    );
    await waitFor(() => expect(api.fetchPriceList).toHaveBeenCalled());
    await waitFor(() => {
      const errors = (store.getState() as any).priceList?.errors;
      expect(errors && [...errors.values()].filter(Boolean).length).toBeGreaterThan(0);
    });
  });
});
