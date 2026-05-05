import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { PriceListType } from 'api/priceList';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import { getFetchId } from 'store/priceList/priceListCommon';
import { updatePriceListFailure, updatePriceListRequest, updatePriceListSuccess } from 'store/priceList/priceListActions';

import { usePriceListDuplicate, usePriceListEnabledToggle, usePriceListUpdate } from './hooks';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: jest.fn(() => jest.fn()),
}));

describe('priceList hooks', () => {
  const setupStore = () =>
    createStore(combineReducers({ [priceListStateKey]: priceListReducer }), applyMiddleware(thunk));

  const wrapperFor =
    (store: ReturnType<typeof setupStore>) =>
    ({ children }: { children: React.ReactNode }) =>
      <Provider store={store}>{children}</Provider>;

  test('usePriceListDuplicate dispatches an update thunk when invoked', () => {
    const store = setupStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const { result } = renderHook(() => usePriceListDuplicate({ uuid: 'pl-1', name: 'List' } as any), {
      wrapper: wrapperFor(store),
    });
    act(() => {
      result.current.duplicatePriceList();
    });
    expect(dispatchSpy.mock.calls.some(([arg]) => typeof arg === 'function')).toBe(true);
  });

  test('usePriceListEnabledToggle dispatches update with flipped enabled flag', () => {
    const store = setupStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const item = {
      effective_end_date: '2025-12-31',
      effective_start_date: '2025-01-01',
      enabled: false,
      name: 'Restored soon',
      uuid: 'pl-2',
    } as any;
    const { result } = renderHook(() => usePriceListEnabledToggle(item), { wrapper: wrapperFor(store) });
    act(() => {
      result.current.togglePriceListEnabled();
    });
    expect(dispatchSpy.mock.calls.some(([arg]) => typeof arg === 'function')).toBe(true);
  });

  test('usePriceListUpdate fires notification when update completes with notification payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getFetchId(PriceListType.priceListAdd);
    let plState = priceListReducer(undefined as any, updatePriceListRequest({ fetchId: fid } as any));
    plState = priceListReducer(
      plState,
      updatePriceListSuccess({} as any, {
        fetchId: fid,
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof priceListReducer = ((state = plState) => state) as any;
    const store = createStore(
      combineReducers({ [priceListStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => usePriceListUpdate({ priceListType: PriceListType.priceListAdd }), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });

  test('usePriceListDuplicate does not call onDuplicate when duplicate fails', async () => {
    const store = setupStore();
    const onDup = jest.fn();
    const { result } = renderHook(() => usePriceListDuplicate({ uuid: 'pl-err', name: 'E' } as any, onDup), {
      wrapper: wrapperFor(store),
    });
    act(() => {
      result.current.duplicatePriceList();
    });
    const fid = getFetchId(PriceListType.priceListDuplicate);
    act(() => {
      store.dispatch(updatePriceListFailure({ message: 'x' } as any, { fetchId: fid } as any));
    });
    await waitFor(() => expect(onDup).not.toHaveBeenCalled());
  });

  test('usePriceListEnabledToggle does not call onUpdateSuccess when update fails', async () => {
    const store = setupStore();
    const onOk = jest.fn();
    const item = { enabled: true, name: 'N', uuid: 'pl-ue' } as any;
    const { result } = renderHook(() => usePriceListEnabledToggle(item, onOk), { wrapper: wrapperFor(store) });
    act(() => {
      result.current.togglePriceListEnabled();
    });
    const fid = getFetchId(PriceListType.priceListUpdate);
    act(() => {
      store.dispatch(updatePriceListFailure({ message: 'x' } as any, { fetchId: fid } as any));
    });
    await waitFor(() => expect(onOk).not.toHaveBeenCalled());
  });

  test('usePriceListUpdate does not add a toast when isNotificationEnabled is false', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getFetchId(PriceListType.priceListAdd);
    let plState = priceListReducer(undefined as any, updatePriceListRequest({ fetchId: fid } as any));
    plState = priceListReducer(
      plState,
      updatePriceListSuccess({} as any, {
        fetchId: fid,
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );
    const frozenReducer: typeof priceListReducer = ((state = plState) => state) as any;
    const store = createStore(
      combineReducers({ [priceListStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => usePriceListUpdate({ isNotificationEnabled: false, priceListType: PriceListType.priceListAdd }), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).not.toHaveBeenCalled());
  });
});
