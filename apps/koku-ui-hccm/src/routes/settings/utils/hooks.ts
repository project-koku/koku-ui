import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import type { AccountSettingsType } from 'api/accountSettings';
import type { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { accountSettingsSelectors } from 'store/accountSettings';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

interface AccountSettingsUpdateProps<T> {
  type: AccountSettingsType;
  getSessionValue: () => T;
  setState: (v: T) => void;
}

interface SettingsUpdateProps {
  type: SettingsType;
}

export const useAccountSettingsNotifications = <T>({
  type,
  getSessionValue,
  setState,
}: AccountSettingsUpdateProps<T>) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) => accountSettingsSelectors.selectAccountSettingsError(state, type)) as
    AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsNotification(state, type)
  );
  const status = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsFetchStatus(state, type)
  );

  useEffect(() => {
    if (status === FetchStatus.complete) {
      if (!error) {
        setState(getSessionValue());
      }
      if (notification) {
        addNotification(notification as any);
        dispatch(settingsActions.resetNotifications());
        dispatch(settingsActions.resetStatus());
      }
    }
  }, [addNotification, dispatch, error, getSessionValue, notification, setState, status]);
};

export const useSettingsNotifications = ({ type }: SettingsUpdateProps) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) => settingsSelectors.selectSettingsError(state, type, undefined)) as
    AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsNotification(state, type, undefined)
  );
  const status = useSelector((state: RootState) => settingsSelectors.selectSettingsFetchStatus(state, type, undefined));

  useEffect(() => {
    if (status === FetchStatus.complete && notification) {
      addNotification(notification as any);
      dispatch(settingsActions.resetNotifications());
      dispatch(settingsActions.resetStatus());
    }
  }, [addNotification, dispatch, error, notification, status]);
};
