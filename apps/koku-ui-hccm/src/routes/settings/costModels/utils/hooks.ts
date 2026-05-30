import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface NotificationProps {
  error: AxiosError;
  isNotificationEnabled?: boolean;
  notification: Notification;
  status: FetchStatus;
}

const useNotification = ({ error, isNotificationEnabled = true, notification, status }: NotificationProps) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  useEffect(() => {
    if ((error || status === FetchStatus.complete) && notification) {
      if (isNotificationEnabled) {
        addNotification(notification as any);
      }
      dispatch(costModelsActions.resetNotifications());
      dispatch(costModelsActions.resetStatus());
    }
  }, [addNotification, dispatch, error, isNotificationEnabled, notification, status]);
};

export const useCostModelAddNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddError(state)) as
    | AxiosError
    | undefined;
  const notification = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddNotification(state));
  const status = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddStatus(state));

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const useCostModelDeleteNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) => costModelsSelectors.selectCostModelsDeleteError(state)) as
    | AxiosError
    | undefined;
  const notification = useSelector((state: RootState) => costModelsSelectors.selectCostModelsDeleteNotification(state));
  const status = useSelector((state: RootState) => costModelsSelectors.selectCostModelsDeleteStatus(state));

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const useCostModelUpdateNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) => costModelsSelectors.selectCostModelsUpdateError(state)) as
    | AxiosError
    | undefined;
  const notification = useSelector((state: RootState) => costModelsSelectors.selectCostModelsUpdateNotification(state));
  const status = useSelector((state: RootState) => costModelsSelectors.selectCostModelsUpdateStatus(state));

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const useCostModelNotifications = (isNotificationEnabled = true) => {
  useCostModelAddNotification(isNotificationEnabled);
  useCostModelDeleteNotification(isNotificationEnabled);
  useCostModelUpdateNotification(isNotificationEnabled);
};
