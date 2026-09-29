import type { Currency } from 'api/currency';
import { CurrencyType } from 'api/currency';
import { getQuery } from 'api/queries/query';
import { type Settings, SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { currencyActions, currencySelectors } from 'store/currency';
import { settingsActions, settingsSelectors } from 'store/settings';

export interface CurrencyProps {
  currency?: Currency;
  currencyError?: AxiosError;
  currencyFetchStatus?: FetchStatus;
}

export interface CurrencySettingsProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

export const useCurrency = (): CurrencyProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const currencyQuery = {
    limit: 1000, // Need all currencies for base and target options
  };
  const currencyQueryString = getQuery(currencyQuery);
  const currency = useSelector((state: RootState) =>
    currencySelectors.selectCurrency(state, CurrencyType.currency, currencyQueryString)
  );
  const currencyError = useSelector((state: RootState) =>
    currencySelectors.selectCurrencyError(state, CurrencyType.currency, currencyQueryString)
  );
  const currencyFetchStatus = useSelector((state: RootState) =>
    currencySelectors.selectCurrencyFetchStatus(state, CurrencyType.currency, currencyQueryString)
  );

  useEffect(() => {
    if (currencyFetchStatus !== FetchStatus.inProgress) {
      dispatch(currencyActions.fetchCurrency(CurrencyType.currency, currencyQueryString));
    }
  }, [dispatch, currencyQueryString]);

  return {
    currency,
    currencyError,
    currencyFetchStatus,
  };
};

export const useCurrencySettings = (): CurrencySettingsProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQuery = {
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
