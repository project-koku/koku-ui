import { act, render, waitFor } from '@testing-library/react';
import { SettingsType } from 'api/settings';
import React, { createRef } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { settingsReducer, settingsStateKey } from 'store/settings';
import { getFetchId } from 'store/settings/settingsCommon';

import type { DeleteRateHandle } from './deleteRate';
import { DeleteRate } from './deleteRate';

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: { formatMessage: (m: { id?: string; defaultMessage?: string }) => m?.defaultMessage || m?.id || 'msg' },
}));

jest.mock('api/settings', () => {
  const actual = jest.requireActual('api/settings');
  return {
    ...actual,
    updateCurrencySettings: jest.fn(() => Promise.resolve({ data: {} })),
  };
});

const settings = [
  {
    code: 'USD',
    static_rates: [
      {
        uuid: 'rate-1',
        base_currency: 'USD',
        target_currency: 'EUR',
        exchange_rate: 1.1,
      },
    ],
  },
] as any;

function makeStoreWithUpdateStatus(status: FetchStatus, error?: unknown) {
  const fetchId = getFetchId(SettingsType.currencyDelete);
  return createStore(
    combineReducers({ [settingsStateKey]: settingsReducer }),
    {
      [settingsStateKey]: {
        byId: new Map(),
        errors: new Map([[fetchId, error ?? null]]),
        notification: new Map(),
        status: new Map([[fetchId, status]]),
      },
    },
    applyMiddleware(thunk)
  );
}

describe('DeleteRate', () => {
  test('delete() invokes onDelete when isDispatch is false', async () => {
    const onDelete = jest.fn();
    const ref = createRef<DeleteRateHandle>();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} isDispatch={false} onDelete={onDelete} settings={settings} uuid="rate-1" />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'rate-1' }));
  });

  test('delete() dispatches currency delete when isDispatch is true', async () => {
    const store = makeStoreWithUpdateStatus(FetchStatus.none);
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);
    const ref = createRef<DeleteRateHandle>();

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} settings={settings} uuid="rate-1" />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    expect(dispatchSpy).toHaveBeenCalled();
  });

  test('invokes onDelete after successful dispatch completes', async () => {
    const onDelete = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete);
    jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);
    const ref = createRef<DeleteRateHandle>();

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} onDelete={onDelete} settings={settings} uuid="rate-1" />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ uuid: 'rate-1' })));
  });

  test('does not delete when uuid is missing', async () => {
    const onDelete = jest.fn();
    const ref = createRef<DeleteRateHandle>();
    const store = makeStoreWithUpdateStatus(FetchStatus.none);

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} isDispatch={false} onDelete={onDelete} settings={settings} />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    expect(onDelete).not.toHaveBeenCalled();
  });

  test('does not delete while request is in progress', async () => {
    const onDelete = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.inProgress);
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);
    const ref = createRef<DeleteRateHandle>();

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} onDelete={onDelete} settings={settings} uuid="rate-1" />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('does not invoke onDelete when dispatch completes with an error', async () => {
    const onDelete = jest.fn();
    const store = makeStoreWithUpdateStatus(FetchStatus.complete, new Error('fail'));
    jest.spyOn(store, 'dispatch').mockImplementation(action => action as any);
    const ref = createRef<DeleteRateHandle>();

    render(
      <Provider store={store}>
        <DeleteRate ref={ref} onDelete={onDelete} settings={settings} uuid="rate-1" />
      </Provider>
    );

    await act(async () => {
      ref.current?.delete();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(onDelete).not.toHaveBeenCalled();
  });
});
