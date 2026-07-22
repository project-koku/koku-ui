import { Tooltip } from '@patternfly/react-core';
import type { AccountSettingsData } from 'api/accountSettings';
import { AccountSettingsType } from 'api/accountSettings';
import type { AxiosError } from 'axios';
import { isSettingsDataRetentionPeriodEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { FetchStatus } from 'store/common';

import { CustomDateRange, DateRange, DateRangeType } from './components';
import { styles } from './dataRetention.styles';
import { useDataRetentionNotifications } from './utils';

interface DataRetentionOwnProps {
  isDisabled?: boolean;
}

export interface DataRetentionStateProps {
  accountSettings?: AccountSettingsData;
  accountSettingsError?: AxiosError;
  accountSettingsFetchStatus?: FetchStatus;
}

type DataRetentionProps = DataRetentionOwnProps;

const DataRetention: React.FC<DataRetentionProps> = ({ isDisabled }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const defaultDataRetentionPeriod = 3;
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [retentionPeriod, setRetentionPeriod] = useState<number>(defaultDataRetentionPeriod);

  const { accountSettings, accountSettingsError, accountSettingsFetchStatus } = useMapToProps();

  // Getters

  const getDateRangeType = (dataRetentionPeriod: number) => {
    switch (dataRetentionPeriod) {
      case 12:
        return DateRangeType.twelveMonths;
      case 6:
        return DateRangeType.sixMonths;
      case 3:
      default:
        return DateRangeType.threeMonths;
    }
  };

  // Handlers

  const handleOnDataRetentionUpdate = (value: number) => {
    setRetentionPeriod(value);

    dispatch(
      accountSettingsActions.updateAccountSettings(AccountSettingsType.dataRetention, {
        data_retention_months: value,
      })
    );
  };

  const handleOnDateRangeSelect = (value: DateRangeType) => {
    if (value === DateRangeType.custom) {
      setIsCustomDateRange(true);
      return;
    }

    let newRetentionPeriod;
    switch (value) {
      case DateRangeType.twelveMonths:
        newRetentionPeriod = 12;
        break;
      case DateRangeType.sixMonths:
        newRetentionPeriod = 6;
        break;
      case DateRangeType.threeMonths:
        newRetentionPeriod = 3;
        break;
    }

    if (newRetentionPeriod !== undefined) {
      setRetentionPeriod(newRetentionPeriod);
      setIsCustomDateRange(false);

      dispatch(
        accountSettingsActions.updateAccountSettings(AccountSettingsType.dataRetention, {
          data_retention_months: newRetentionPeriod,
        })
      );
    }
  };

  // Events

  useEffect(() => {
    if (accountSettings && !accountSettingsError && accountSettingsFetchStatus !== FetchStatus.inProgress) {
      const dataRetentionPeriod = accountSettings?.data_retention_months || defaultDataRetentionPeriod;

      setRetentionPeriod(dataRetentionPeriod);

      const isCustom = dataRetentionPeriod !== 3 && dataRetentionPeriod !== 6 && dataRetentionPeriod !== 12;
      setIsCustomDateRange(isCustom);
    }
  }, [accountSettings, accountSettingsError, accountSettingsFetchStatus]);

  if (accountSettingsError) {
    return <NotAvailable />;
  }

  if (accountSettingsFetchStatus === FetchStatus.inProgress) {
    return (
      <LoadingState
        body={intl.formatMessage(messages.dataRetentionLoadingStateDesc)}
        heading={intl.formatMessage(messages.dataRetentionLoadingStateTitle)}
      />
    );
  }

  const isReadOnly = isDisabled || accountSettings?.env_override === true;
  const dateRange = (
    <div style={styles.dateRange}>
      <DateRange
        dateRangeType={isCustomDateRange ? DateRangeType.custom : getDateRangeType(retentionPeriod)}
        isDisabled={isReadOnly}
        onSelect={handleOnDateRangeSelect}
      />
      {isCustomDateRange && (
        <div style={styles.customDateRange}>
          <CustomDateRange
            inputValue={retentionPeriod}
            isDisabled={isReadOnly}
            onUpdate={handleOnDataRetentionUpdate}
          />
        </div>
      )}
    </div>
  );
  return accountSettings?.env_override === true ? (
    <Tooltip content={intl.formatMessage(messages.readOnlyDataRetention)}>{dateRange}</Tooltip>
  ) : (
    dateRange
  );
};

const useMapToProps = (): DataRetentionStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const accountSettings = useSelector(
    (state: RootState) =>
      accountSettingsSelectors.selectAccountSettings(state, AccountSettingsType.dataRetention) as AccountSettingsData
  );
  const accountSettingsError = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsError(state, AccountSettingsType.dataRetention)
  );
  const accountSettingsFetchStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsFetchStatus(state, AccountSettingsType.dataRetention)
  );

  useEffect(() => {
    if (!accountSettings && !accountSettingsError && accountSettingsFetchStatus !== FetchStatus.inProgress) {
      dispatch(accountSettingsActions.fetchAccountSettings(AccountSettingsType.dataRetention));
    }
  }, [accountSettings, accountSettingsError, dispatch]);

  // Notifications disabled for on-prem
  useDataRetentionNotifications(isSettingsDataRetentionPeriodEnabled);

  return {
    accountSettings,
    accountSettingsError,
    accountSettingsFetchStatus,
  };
};

export { DataRetention };
