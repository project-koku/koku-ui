import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListStateKey } from 'store/priceList';

import { AddRateModal } from './addRateModal';

jest.mock('../ratesContent', () => {
  const React = require('react');
  return {
    RatesContent: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        save: () =>
          props.onSave?.([
            {
              cost_type: 'Infrastructure',
              custom_name: 'Rate',
              metric: { name: 'cpu_core_request' },
            },
          ]),
      }));
      React.useLayoutEffect(() => {
        props.onDisabled?.(false);
      });
      return <div data-testid="rates-mock" />;
    }),
  };
});

const priceList = { currency: 'USD', rates: [], uuid: 'pl-1' } as any;

function makeStoreWithUpdateStatus(status: FetchStatus, error?: unknown) {
  const fetchId = `${PriceListType.priceListUpdate}--`;
  return createStore(
    combineReducers({ [priceListStateKey]: priceListReducer }),
    {
      [priceListStateKey]: {
        byId: new Map(),
        errors: new Map([[fetchId, error ?? null]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    },
    applyMiddleware(thunk)
  );
}

describe('AddRateModal', () => {
  test('invokes onAdd when primary button triggers RatesContent save', () => {
    const onAdd = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <AddRateModal isOpen onAdd={onAdd} priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ custom_name: 'Rate', metric: { name: 'cpu_core_request' } }),
      ])
    );
  });

  test('dispatches update when onAdd omitted', () => {
    const dispatchSpy = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    jest.spyOn(store, 'dispatch').mockImplementation(dispatchSpy);

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <AddRateModal isOpen priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('calls onSuccess when update completes without error', async () => {
    const onSuccess = jest.fn();
    const onAdd = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <AddRateModal isDispatch={false} isOpen onAdd={onAdd} onSuccess={onSuccess} priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /add rate/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(onAdd).toHaveBeenCalled();
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <AddRateModal isOpen onClose={onClose} priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('primary button disabled while update in progress', () => {
    const store = makeStoreWithUpdateStatus(FetchStatus.inProgress);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <AddRateModal isOpen priceList={priceList} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /add rate/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
