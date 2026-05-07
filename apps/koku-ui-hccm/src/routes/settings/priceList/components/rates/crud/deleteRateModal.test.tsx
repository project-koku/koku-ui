import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListReducer, priceListStateKey } from 'store/priceList';

import { DeleteRateModal } from './deleteRateModal';

jest.mock('./deleteRateContent', () => {
  const React = require('react');
  return {
    DeleteRateContent: React.forwardRef((props: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({
        submit: () => props.onDelete?.([]),
      }));
      return <div data-testid="delete-content-mock" />;
    }),
  };
});

const priceList = {
  currency: 'USD',
  rates: [
    {
      cost_type: 'Infrastructure',
      custom_name: 'r1',
      metric: { label_metric: 'CPU', name: 'cpu_core_request' },
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

describe('DeleteRateModal', () => {
  test('invokes onDelete from DeleteRateContent submit path via dispatch when onDelete omitted', () => {
    const dispatchSpy = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    jest.spyOn(store, 'dispatch').mockImplementation(dispatchSpy);

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('calls onDeleteSuccess when update completes', async () => {
    const onDeleteSuccess = jest.fn();
    const onDelete = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onDelete={onDelete} onDeleteSuccess={onDeleteSuccess} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => expect(onDeleteSuccess).toHaveBeenCalled());
    expect(onDelete).toHaveBeenCalledWith([]);
  });

  test('cancel invokes onClose', () => {
    const onClose = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onClose={onClose} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  test('delete button disabled while update in progress', () => {
    const store = makeStoreWithUpdateStatus(FetchStatus.inProgress);
    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /^delete$/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
