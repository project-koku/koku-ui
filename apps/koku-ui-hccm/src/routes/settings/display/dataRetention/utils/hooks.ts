import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { DataRetentionType } from 'api/dataRetention';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { dataRetentionActions, dataRetentionSelectors } from 'store/dataRetention';
import type { Notification } from 'utils/notification';

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
      dispatch(dataRetentionActions.resetNotifications());
      dispatch(dataRetentionActions.resetStatus());
    }
  }, [addNotification, dispatch, error, isNotificationEnabled, notification, status]);
};

export const useDataRetentionNotifications = (isNotificationEnabled = true) => {
  const error = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetentionError(state, DataRetentionType.dataRetentionUpdate, undefined)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetentionNotification(state, DataRetentionType.dataRetentionUpdate, undefined)
  );
  const status = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetentionFetchStatus(state, DataRetentionType.dataRetentionUpdate, undefined)
  );

  useNotification({ error, isNotificationEnabled, notification, status });
};
