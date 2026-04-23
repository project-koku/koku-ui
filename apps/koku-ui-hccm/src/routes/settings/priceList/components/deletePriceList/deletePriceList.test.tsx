import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListSelectors, priceListStateKey } from 'store/priceList';

import DeletePriceList from './deletePriceList';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, updatePriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('DeletePriceList', () => {
  jest.useRealTimers();

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('confirm dispatches remove and completes update in the store', async () => {
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeletePriceList isOpen item={{ uuid: 'u-del', name: 'To remove' } as any} />
        </IntlProvider>
      </Provider>
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        priceListSelectors.selectPriceListUpdateStatus(store.getState() as any, PriceListType.priceListRemove)
      ).toBe(FetchStatus.complete)
    );
  });
});
