import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListSelectors, priceListStateKey } from 'store/priceList';

import { DeletePriceListModal } from './deletePriceListModal';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { ...actual, updatePriceList: jest.fn(() => Promise.resolve({})) };
});

import * as api from 'api/priceList';

describe('DeletePriceListModal', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('delete dispatches remove and calls onSuccess when complete', async () => {
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
    const store = setupStore();
    const onSuccess = jest.fn();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeletePriceListModal isOpen onSuccess={onSuccess} priceList={{ name: 'Z', uuid: 'del-1' } as any} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        priceListSelectors.selectPriceListUpdateStatus(store.getState() as any, PriceListType.priceListRemove)
      ).toBe(FetchStatus.complete)
    );
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    render(
      <Provider store={setupStore()}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeletePriceListModal isOpen onClose={onClose} priceList={{ uuid: 'x', name: 'Y' } as any} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
