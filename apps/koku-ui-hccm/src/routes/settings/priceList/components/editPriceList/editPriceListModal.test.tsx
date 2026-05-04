import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListSelectors, priceListStateKey } from 'store/priceList';

import { EditPriceListModal } from './editPriceListModal';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, updatePriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('EditPriceListModal', () => {
  jest.useRealTimers();

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('save dispatches update and completes in the store', async () => {
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditPriceListModal isOpen priceList={{ uuid: 'u-edit', name: 'My list' } as any} />
        </IntlProvider>
      </Provider>
    );
    const dialog = screen.getByRole('dialog');
    const nameInput = within(dialog).getAllByRole('textbox')[0];
    fireEvent.change(nameInput, { target: { value: 'My list updated' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /^save$/i }));
    await waitFor(() =>
      expect(api.updatePriceList).toHaveBeenCalledWith(
        PriceListType.priceListUpdate,
        'u-edit',
        expect.objectContaining({ name: 'My list updated' })
      )
    );
    await waitFor(() =>
      expect(
        priceListSelectors.selectPriceListUpdateStatus(store.getState() as any, PriceListType.priceListUpdate)
      ).toBe(FetchStatus.complete)
    );
  });
});
