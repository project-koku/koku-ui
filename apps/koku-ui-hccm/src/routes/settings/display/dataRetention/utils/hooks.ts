import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { AccountSettingsType } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { getFetchId } from 'store/accountSettings/accountSettingsCommon';
import { FetchStatus } from 'store/common';
import type { Notification } from 'utils/notification';

interface NotificationProps {
  error: AxiosError;
  isNotificationEnabled?: boolean;
  notification: Notification;
  status: FetchStatus;
  type: AccountSettingsType;
}

const useNotification = ({ error, isNotificationEnabled = true, notification, status, type }: NotificationProps) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  useEffect(() => {
    if ((error || status === FetchStatus.complete) && notification) {
      if (isNotificationEnabled) {
        addNotification(notification as any);
      }
      const fetchId = getFetchId(type);
      dispatch(accountSettingsActions.resetNotifications({ fetchId }));
      dispatch(accountSettingsActions.resetStatus({ fetchId }));
    }
  }, [addNotification, dispatch, error, isNotificationEnabled, notification, status, type]);
};

export const useDataRetentionNotifications = (isNotificationEnabled = true) => {
  const error = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsError(state, AccountSettingsType.dataRetention)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsNotification(state, AccountSettingsType.dataRetention)
  );
  const status = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsFetchStatus(state, AccountSettingsType.dataRetention)
  );

  useNotification({ error, isNotificationEnabled, notification, status, type: AccountSettingsType.dataRetention });
};
