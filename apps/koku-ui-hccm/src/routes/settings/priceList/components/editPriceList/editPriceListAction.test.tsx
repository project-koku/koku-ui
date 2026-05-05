import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { EditPriceListAction } from './editPriceListAction';

describe('EditPriceListAction', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  test('icon toggles the edit details modal', async () => {
    const store = setupStore();
    const priceList = { uuid: 'u-edit-act', name: 'Editable' } as any;
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditPriceListAction canWrite priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.queryByRole('heading', { name: /edit price list details/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /remove child tag/i }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /edit price list details/i })).toBeInTheDocument()
    );
  });
});
