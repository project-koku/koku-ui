import type { AccountSettingsType } from '@koku-ui/api/accountSettings';
import type { SettingsType } from '@koku-ui/api/settings';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import { useAddNotification } from '../../../init';
import type { RootState } from '../../../store';
import { accountSettingsSelectors } from '../../../store/accountSettings';
import { FetchStatus } from '../../../store/common';
import { settingsSelectors } from '../../../store/settings';
import { resetStatus } from '../../../store/settings/settingsActions';

interface AccountSettingsUpdateProps<T> {
  type: AccountSettingsType;
  getSessionValue: () => T;
  setState: (v: T) => void;
}

interface SettingsUpdateProps {
  type: SettingsType;
}

interface SettingsNotificationProps {
  error: AxiosError;
  notification: Notification;
  status: FetchStatus;
}

export const useAccountSettingsUpdate = <T>({
  type,
  getSessionValue,
  setState,
}: AccountSettingsUpdateProps<T>): SettingsNotificationProps => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateError(state, type)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateNotification(state, type)
  );
  const status = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsUpdateStatus(state, type)
  );

  useEffect(() => {
    if (status === FetchStatus.complete) {
      if (!error) {
        setState(getSessionValue());
      }
      if (notification) {
        addNotification(notification as any);
        dispatch(resetStatus());
      }
    }
  }, [addNotification, dispatch, error, getSessionValue, notification, setState, status]);

  return { error, notification, status };
};

export const useSettingsUpdate = ({ type }: SettingsUpdateProps): SettingsNotificationProps => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) => settingsSelectors.selectSettingsUpdateError(state, type)) as
    | AxiosError
    | undefined;
  const notification = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateNotification(state, type)
  );
  const status = useSelector((state: RootState) => settingsSelectors.selectSettingsUpdateStatus(state, type));

  useEffect(() => {
    if (status === FetchStatus.complete && notification) {
      addNotification(notification as any);
      dispatch(resetStatus());
    }
  }, [addNotification, dispatch, error, notification, status]);

  return { error, notification, status };
};
