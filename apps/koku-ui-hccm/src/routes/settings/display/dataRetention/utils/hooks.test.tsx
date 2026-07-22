import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { AccountSettingsType } from 'api/accountSettings';
import { accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
import { getFetchId } from 'store/accountSettings/accountSettingsCommon';
import {
  updateAccountSettingsFailure,
  updateAccountSettingsRequest,
  updateAccountSettingsSuccess,
} from 'store/accountSettings/accountSettingsActions';

import { useDataRetentionNotifications } from './hooks';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: jest.fn(() => jest.fn()),
}));

describe('useDataRetentionNotifications', () => {
  const wrapperFor =
    (store: ReturnType<typeof createStore>) =>
    ({ children }: { children: React.ReactNode }) =>
      <Provider store={store}>{children}</Provider>;

  const buildStoreWithUpdate = (
    outcome: 'success' | 'failure',
    notification: { title: string; variant: string }
  ) => {
    const fid = getFetchId(AccountSettingsType.dataRetention);
    let asState = accountSettingsReducer(undefined as any, updateAccountSettingsRequest({ fetchId: fid } as any));
    asState = accountSettingsReducer(
      asState,
      outcome === 'success'
        ? updateAccountSettingsSuccess({} as any, {
            fetchId: fid,
            notification,
          } as any)
        : updateAccountSettingsFailure({ message: 'x' } as any, {
            fetchId: fid,
            notification,
          } as any)
    );

    const frozenReducer: typeof accountSettingsReducer = ((state = asState) => state) as any;
    return createStore(combineReducers({ [accountSettingsStateKey]: frozenReducer }), applyMiddleware(thunk));
  };

  test('fires notification when update completes with notification payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as {
      useAddNotification: jest.Mock;
    };
    useAddNotification.mockReturnValue(addNotification);

    const store = buildStoreWithUpdate('success', { title: 'Done', variant: 'success' });

    renderHook(() => useDataRetentionNotifications(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });

  test('does not add a toast when isNotificationEnabled is false', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as {
      useAddNotification: jest.Mock;
    };
    useAddNotification.mockReturnValue(addNotification);

    const store = buildStoreWithUpdate('success', { title: 'Done', variant: 'success' });

    renderHook(() => useDataRetentionNotifications(false), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).not.toHaveBeenCalled());
  });

  test('fires notification on update failure with error payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as {
      useAddNotification: jest.Mock;
    };
    useAddNotification.mockReturnValue(addNotification);

    const store = buildStoreWithUpdate('failure', { title: 'Error', variant: 'danger' });

    renderHook(() => useDataRetentionNotifications(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });
});
