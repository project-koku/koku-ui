import { getQuery } from 'api/queries/query';
import { type Settings, SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

export interface CurrencySettingsProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

export const useCurrencySettings = (): CurrencySettingsProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
    filter: {
      enabled: true, // Show only enabled
    },
    limit: 1000, // Need all currencies for base and target options
  };
  const settingsQueryString = getQuery(settingsQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.currency, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currency, settingsQueryString)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currency, settingsQueryString)
  );

  // Refetch enabled options after enable/disable so selectors drop disabled currencies
  const currencyDisableFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currencyDisable, undefined)
  );
  const currencyEnableFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currencyEnable, undefined)
  );

  useEffect(() => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      dispatch(settingsActions.fetchSettings(SettingsType.currency, settingsQueryString));
    }
  }, [dispatch, settingsQueryString]);

  useEffect(() => {
    if (currencyDisableFetchStatus === FetchStatus.complete || currencyEnableFetchStatus === FetchStatus.complete) {
      dispatch(settingsActions.fetchSettings(SettingsType.currency, settingsQueryString));
    }
  }, [currencyDisableFetchStatus, currencyEnableFetchStatus, dispatch, settingsQueryString]);

  return {
    settings,
    settingsError,
    settingsFetchStatus,
  };
};
