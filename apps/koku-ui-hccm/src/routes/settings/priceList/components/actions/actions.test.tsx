import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { priceListReducer, priceListStateKey } from 'store/priceList';

import { Actions } from './index';

describe('PriceList Actions', () => {
  const item = { uuid: 'pl-1', name: 'My list' } as any;

  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const renderWithStore = (ui: React.ReactElement) => {
    const store = setupStore();
    return render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );
  };

  test('opens delete confirmation from the kebab menu', async () => {
    renderWithStore(<Actions canWrite isDisabled={false} item={item} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /delete price list/i }));
    expect(await screen.findByRole('heading', { name: /remove price list/i })).toBeInTheDocument();
  });

  test('opens deprecate dialog from the kebab menu', async () => {
    renderWithStore(<Actions canWrite isDisabled={false} item={item} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /deprecate price list/i }));
    expect(await screen.findByRole('heading', { name: /deprecate this price list/i })).toBeInTheDocument();
  });

  test('invokes onDuplicate when duplicate is chosen', async () => {
    const onDuplicate = jest.fn();
    renderWithStore(<Actions canWrite isDisabled={false} item={item} onDuplicate={onDuplicate} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /duplicate price list/i }));
    await waitFor(() => expect(onDuplicate).toHaveBeenCalled());
  });
});
