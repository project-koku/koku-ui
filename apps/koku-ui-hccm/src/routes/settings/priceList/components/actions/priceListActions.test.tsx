import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListSelectors, priceListStateKey } from 'store/priceList';

import { PriceListActions } from './priceListActions';

jest.mock('routes/settings/priceList/utils/hooks', () => ({
  usePriceListDuplicate: (priceList: unknown, onDuplicate?: () => void) => ({
    duplicatePriceList: () => onDuplicate?.(),
  }),
  usePriceListEnabledToggle: (priceList: unknown, onDeprecate?: () => void) => ({
    togglePriceListEnabled: () => onDeprecate?.(),
  }),
}));

jest.mock('api/priceList', () => {
  const actual = jest.requireActual('api/priceList');
  return { ...actual, updatePriceList: jest.fn(() => Promise.resolve({})) };
});

import * as api from 'api/priceList';

describe('PriceListActions', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const renderActions = (ui: React.ReactElement, store = setupStore()) =>
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          {ui}
        </IntlProvider>
      </Provider>
    );

  const basePl = { enabled: true, name: 'My PL', uuid: 'u1' } as any;

  beforeEach(() => {
    (api.updatePriceList as jest.Mock).mockClear();
    (api.updatePriceList as jest.Mock).mockResolvedValue({});
  });

  test('opens delete modal from kebab', async () => {
    renderActions(<PriceListActions canWrite priceList={basePl} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /delete price list/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('deprecated list shows restore and calls toggle hook', async () => {
    const onDeprecate = jest.fn();
    renderActions(
      <PriceListActions canWrite onDeprecate={onDeprecate} priceList={{ ...basePl, enabled: false }} />
    );
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /^restore$/i }));
    await waitFor(() => expect(onDeprecate).toHaveBeenCalled());
  });

  test('duplicate menu invokes onDuplicate from hook mock', async () => {
    const onDuplicate = jest.fn();
    renderActions(<PriceListActions canWrite onDuplicate={onDuplicate} priceList={basePl} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /duplicate/i }));
    await waitFor(() => expect(onDuplicate).toHaveBeenCalled());
  });

  test('delete modal cancel invokes onClose', async () => {
    const onClose = jest.fn();
    renderActions(<PriceListActions canWrite onClose={onClose} priceList={basePl} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /delete price list/i }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('deprecate modal cancel invokes onClose', async () => {
    const onClose = jest.fn();
    renderActions(<PriceListActions canWrite onClose={onClose} priceList={basePl} />);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /deprecate/i }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /cancel/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test('delete modal confirm dispatches remove and completes', async () => {
    const store = setupStore();
    const onDelete = jest.fn();
    renderActions(<PriceListActions canWrite onDelete={onDelete} priceList={basePl} />, store);
    fireEvent.click(screen.getByRole('button', { name: /more options/i }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /delete price list/i }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(api.updatePriceList).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        priceListSelectors.selectPriceListUpdateStatus(store.getState() as any, PriceListType.priceListRemove)
      ).toBe(FetchStatus.complete)
    );
    await waitFor(() => expect(onDelete).toHaveBeenCalled());
  });
});
