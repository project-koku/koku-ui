import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { DataRetentionType } from 'api/dataRetention';
import { dataRetentionReducer, dataRetentionStateKey } from 'store/dataRetention';
import { getFetchId } from 'store/dataRetention/dataRetentionCommon';
import {
  updateDataRetentionFailure,
  updateDataRetentionRequest,
  updateDataRetentionSuccess,
} from 'store/dataRetention/dataRetentionActions';

import { useDataRetentionNotifications } from './hooks';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: jest.fn(() => jest.fn()),
}));

describe('useDataRetentionNotifications', () => {
  const wrapperFor =
    (store: ReturnType<typeof createStore>) =>
    ({ children }: { children: React.ReactNode }) =>
      <Provider store={store}>{children}</Provider>;

  test('fires notification when update completes with notification payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getFetchId(DataRetentionType.dataRetentionUpdate);
    let drState = dataRetentionReducer(undefined as any, updateDataRetentionRequest({ fetchId: fid } as any));
    drState = dataRetentionReducer(
      drState,
      updateDataRetentionSuccess({} as any, {
        fetchId: fid,
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof dataRetentionReducer = ((state = drState) => state) as any;
    const store = createStore(
      combineReducers({ [dataRetentionStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useDataRetentionNotifications(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });

  test('does not add a toast when isNotificationEnabled is false', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getFetchId(DataRetentionType.dataRetentionUpdate);
    let drState = dataRetentionReducer(undefined as any, updateDataRetentionRequest({ fetchId: fid } as any));
    drState = dataRetentionReducer(
      drState,
      updateDataRetentionSuccess({} as any, {
        fetchId: fid,
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof dataRetentionReducer = ((state = drState) => state) as any;
    const store = createStore(
      combineReducers({ [dataRetentionStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useDataRetentionNotifications(false), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).not.toHaveBeenCalled());
  });

  test('fires notification on update failure with error payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    const fid = getFetchId(DataRetentionType.dataRetentionUpdate);
    let drState = dataRetentionReducer(undefined as any, updateDataRetentionRequest({ fetchId: fid } as any));
    drState = dataRetentionReducer(
      drState,
      updateDataRetentionFailure({ message: 'x' } as any, {
        fetchId: fid,
        notification: { title: 'Error', variant: 'danger' },
      } as any)
    );

    const frozenReducer: typeof dataRetentionReducer = ((state = drState) => state) as any;
    const store = createStore(
      combineReducers({ [dataRetentionStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useDataRetentionNotifications(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });
});
