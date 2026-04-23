import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListSelectors, priceListStateKey } from 'store/priceList';

import DeprecatePriceList from './deprecatePriceList';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, updatePriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('DeprecatePriceList', () => {
  jest.useRealTimers();

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('confirm dispatches update with enabled false, required name, and completes in the store', async () => {
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeprecatePriceList isOpen item={{ uuid: 'u-dep', name: 'To deprecate', enabled: true } as any} />
        </IntlProvider>
      </Provider>
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^deprecate$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
    const [, query, payload] = (api.updatePriceList as jest.Mock).mock.calls[0];
    expect(payload).toEqual({ enabled: false, name: 'To deprecate' });
    expect(String(query)).toContain('u-dep');
    await waitFor(() =>
      expect(
        priceListSelectors.selectPriceListUpdateStatus(store.getState() as any, PriceListType.priceListUpdate)
      ).toBe(FetchStatus.complete)
    );
  });
});
