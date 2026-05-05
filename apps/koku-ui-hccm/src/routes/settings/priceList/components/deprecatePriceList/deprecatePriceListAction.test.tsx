import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { DeprecatePriceListAction } from './deprecatePriceListAction';

describe('DeprecatePriceListAction', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('enabled item uses deprecate label and opens deprecate modal', async () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeprecatePriceListAction canWrite priceList={{ uuid: 'u-d', name: 'Active', enabled: true } as any} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /^deprecate$/i }));
    expect(await screen.findByRole('heading', { name: /deprecate this price list/i })).toBeInTheDocument();
  });

  test('disabled item uses restore label', () => {
    const store = setupStore();
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeprecatePriceListAction canWrite priceList={{ uuid: 'u-r', name: 'Old', enabled: false } as any} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /^restore$/i })).toBeInTheDocument();
  });
});
