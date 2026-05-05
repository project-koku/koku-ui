import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { DeletePriceListAction } from './deletePriceListAction';

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { __esModule: true, ...actual, updatePriceList: jest.fn() };
});

import * as api from 'api/priceList';

describe('DeletePriceListAction', () => {
  jest.useRealTimers();

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('icon opens modal and confirm removes the price list', async () => {
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
    const store = setupStore();
    const priceList = { uuid: 'u-act', name: 'Remove me' } as any;
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeletePriceListAction canWrite priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /remove child tag/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
  });
});
