import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { AccountSettingsType } from 'api/accountSettings';
import { SettingsType } from 'api/settings';
import { accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
import { getFetchId as getAccountSettingsFetchId } from 'store/accountSettings/accountSettingsCommon';
import {
  updateAccountSettingsRequest,
  updateAccountSettingsSuccess,
} from 'store/accountSettings/accountSettingsActions';
import { settingsReducer, settingsStateKey } from 'store/settings';
import { getFetchId as getSettingsFetchId } from 'store/settings/settingsCommon';
import { updateTagSettingsRequest, updateTagSettingsSuccess } from 'store/settings/settingsActions';

import { useAccountSettingsNotifications, useSettingsNotifications } from './hooks';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: jest.fn(() => jest.fn()),
}));

describe('settings notification hooks', () => {
  const wrapperFor =
    (store: ReturnType<typeof createStore>) =>
    ({ children }: { children: React.ReactNode }) =>
      <Provider store={store}>{children}</Provider>;

  test('useSettingsNotifications fires a toast and resets status', async () => {
    const addNotification = jest.fn();
    const { useAddNotification } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as {
      useAddNotification: jest.Mock;
    };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getSettingsFetchId(SettingsType.tagsEnable);
    let slice = settingsReducer(undefined as any, updateTagSettingsRequest({ fetchId: fid } as any));
    slice = settingsReducer(
      slice,
      updateTagSettingsSuccess({} as any, { fetchId: fid, notification: { title: 'Enabled' } } as any)
    );
    const frozenReducer: typeof settingsReducer = ((state = slice) => state) as any;
    const store = createStore(combineReducers({ [settingsStateKey]: frozenReducer }), applyMiddleware(thunk));
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderHook(() => useSettingsNotifications({ type: SettingsType.tagsEnable }), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'settings/notification/reset' }));
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'settings/status/reset' }));
  });

  test('useAccountSettingsNotifications updates state and fires a toast', async () => {
    const addNotification = jest.fn();
    const { useAddNotification } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as {
      useAddNotification: jest.Mock;
    };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getAccountSettingsFetchId(AccountSettingsType.currency);
    let slice = accountSettingsReducer(undefined as any, updateAccountSettingsRequest({ fetchId: fid } as any));
    slice = accountSettingsReducer(
      slice,
      updateAccountSettingsSuccess({} as any, { fetchId: fid, notification: { title: 'Saved' } } as any)
    );
    const frozenReducer: typeof accountSettingsReducer = ((state = slice) => state) as any;
    const store = createStore(combineReducers({ [accountSettingsStateKey]: frozenReducer }), applyMiddleware(thunk));
    const setState = jest.fn();
    const getSessionValue = jest.fn(() => 'USD');

    renderHook(
      () =>
        useAccountSettingsNotifications({
          type: AccountSettingsType.currency,
          getSessionValue,
          setState,
        }),
      { wrapper: wrapperFor(store) }
    );

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
    expect(setState).toHaveBeenCalledWith('USD');
  });
});
