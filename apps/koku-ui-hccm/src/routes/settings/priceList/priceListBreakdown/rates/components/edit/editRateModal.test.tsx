import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListStateKey } from 'store/priceList';

import { EditRateModal } from './editRateModal';

jest.mock('../ratesContent', () => {
  const React = require('react');
  return {
    RatesContent: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        save: () =>
          props.onSave?.([
            {
              cost_type: 'Infrastructure',
              custom_name: 'Edited',
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

const priceList = {
  currency: 'USD',
  rates: [
    {
      cost_type: 'Infrastructure',
      custom_name: 'CPU rate',
      metric: { name: 'cpu_core_request' },
      tiered_rates: [{ unit: 'USD', value: 1 }],
    },
  ],
  uuid: 'pl-1',
} as any;

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

describe('EditRateModal', () => {
  test('invokes onEdit when save clicked', () => {
    const onEdit = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isOpen onEdit={onEdit} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /edit rate/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  test('dispatches update when onEdit omitted', () => {
    const dispatchSpy = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    jest.spyOn(store, 'dispatch').mockImplementation(dispatchSpy);

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isOpen priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /edit rate/i }));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('invokes onEdit when isDispatch false (parent refresh path)', () => {
    const onEdit = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isDispatch={false} isOpen onEdit={onEdit} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /edit rate/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ custom_name: 'Edited', metric: { name: 'cpu_core_request' } })])
    );
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <EditRateModal isOpen onClose={onClose} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
