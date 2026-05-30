import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import {
  addCostModelsRequest,
  addCostModelsSuccess,
  deleteCostModelsRequest,
  deleteCostModelsSuccess,
  updateCostModelsRequest,
  updateCostModelsSuccess,
} from 'store/costModels/costModelActions';

import { useCostModelAddNotification, useCostModelNotifications } from './hooks';

jest.mock('@redhat-cloud-services/frontend-components-notifications/hooks', () => ({
  useAddNotification: jest.fn(() => jest.fn()),
}));

describe('cost model hooks', () => {
  const wrapperFor =
    (store: ReturnType<typeof createStore>) =>
    ({ children }: { children: React.ReactNode }) =>
      React.createElement(Provider, { store }, children);

  test('useCostModelAddNotification fires notification when add completes with notification payload', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    let cmState = costModelsReducer(undefined as any, addCostModelsRequest());
    cmState = costModelsReducer(
      cmState,
      addCostModelsSuccess({ data: {} } as any, {
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof costModelsReducer = ((state = cmState) => state) as any;
    const store = createStore(
      combineReducers({ [costModelsStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useCostModelAddNotification(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).toHaveBeenCalled());
  });

  test('useCostModelAddNotification does not add a toast when isNotificationEnabled is false', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    let cmState = costModelsReducer(undefined as any, addCostModelsRequest());
    cmState = costModelsReducer(
      cmState,
      addCostModelsSuccess({ data: {} } as any, {
        notification: { title: 'Done', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof costModelsReducer = ((state = cmState) => state) as any;
    const store = createStore(
      combineReducers({ [costModelsStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useCostModelAddNotification(false), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).not.toHaveBeenCalled());
  });

  test('useCostModelNotifications fires notifications for add, delete, and update when complete', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    let cmState = costModelsReducer(undefined as any, addCostModelsRequest());
    cmState = costModelsReducer(
      cmState,
      addCostModelsSuccess({ data: {} } as any, {
        notification: { title: 'Added', variant: 'success' },
      } as any)
    );
    cmState = costModelsReducer(
      cmState,
      deleteCostModelsSuccess(undefined, {
        notification: { title: 'Deleted', variant: 'success' },
      } as any)
    );
    cmState = costModelsReducer(
      cmState,
      updateCostModelsSuccess({ data: {} } as any, {
        notification: { title: 'Updated', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof costModelsReducer = ((state = cmState) => state) as any;
    const store = createStore(
      combineReducers({ [costModelsStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useCostModelNotifications(true), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification.mock.calls.length).toBeGreaterThanOrEqual(1));
  });

  test('useCostModelNotifications does not toast when disabled', async () => {
    const addNotification = jest.fn();
    const {
      useAddNotification,
    } = require('@redhat-cloud-services/frontend-components-notifications/hooks') as { useAddNotification: jest.Mock };
    useAddNotification.mockReturnValue(addNotification);

    let cmState = costModelsReducer(undefined as any, deleteCostModelsRequest());
    cmState = costModelsReducer(
      cmState,
      deleteCostModelsSuccess(undefined, {
        notification: { title: 'Deleted', variant: 'success' },
      } as any)
    );

    const frozenReducer: typeof costModelsReducer = ((state = cmState) => state) as any;
    const store = createStore(
      combineReducers({ [costModelsStateKey]: frozenReducer }),
      applyMiddleware(thunk)
    );

    renderHook(() => useCostModelNotifications(false), {
      wrapper: wrapperFor(store),
    });

    await waitFor(() => expect(addNotification).not.toHaveBeenCalled());
  });
});
