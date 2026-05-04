import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { PriceListType } from 'api/priceList';
import { FetchStatus } from 'store/common';
import { priceListStateKey } from 'store/priceList';
import { getFetchId } from 'store/priceList/priceListCommon';
import { configureStore } from 'store/store';

import { DeleteRateModal } from './deleteRateModal';

describe('DeleteRateModal', () => {
  test('shows delete dialog with metric and price list context', () => {
    const store = configureStore({} as any);
    const priceList = {
      name: 'My list',
      uuid: 'pl-del',
      assigned_cost_model_count: 0,
      rates: [
        {
          metric: { name: 'm1', label_metric: 'CPU' },
          tiered_rates: [{ unit: 'USD', value: 1 }],
        },
      ],
    } as any;

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onClose={jest.fn()} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/delete rate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });

  test('shows assigned cost models when the rate is linked to active cost models', () => {
    const store = configureStore({} as any);
    const priceList = {
      name: 'Linked PL',
      uuid: 'pl-linked',
      assigned_cost_model_count: 2,
      assigned_cost_models: [{ name: 'CM Alpha' }, { name: 'CM Beta' }],
      rates: [
        {
          metric: { name: 'm1', label_metric: 'GPU' },
          tiered_rates: [{ unit: 'USD', value: 1 }],
        },
      ],
    } as any;

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onClose={jest.fn()} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getByText('CM Alpha')).toBeInTheDocument();
    expect(screen.getByText('CM Beta')).toBeInTheDocument();
  });

  test('does not dispatch delete while another price list update is in progress', () => {
    const updateFid = getFetchId(PriceListType.priceListUpdate, undefined);
    const store = configureStore({
      [priceListStateKey]: {
        byId: new Map(),
        errors: new Map(),
        notification: new Map(),
        status: new Map([[updateFid, FetchStatus.inProgress]]),
      },
    } as any);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const priceList = {
      name: 'PL',
      uuid: 'pl-u',
      assigned_cost_model_count: 0,
      rates: [{ metric: { name: 'm1', label_metric: 'CPU' }, tiered_rates: [{ unit: 'USD', value: 1 }] }],
    } as any;

    render(
      <Provider store={store}>
        <IntlProvider defaultLocale="en" locale="en">
          <DeleteRateModal isOpen onClose={jest.fn()} priceList={priceList} rateIndex={0} />
        </IntlProvider>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    const thunkDispatches = dispatchSpy.mock.calls.filter(([a]) => typeof a === 'function');
    expect(thunkDispatches.length).toBe(0);
    dispatchSpy.mockRestore();
  });
});
