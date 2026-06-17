import { DataRetention, DataRetentionType } from 'api/dataRetention';
import { getQuery } from 'api/queries/query';
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
import { FetchStatus } from 'store/common';
import { dataRetentionActions, dataRetentionSelectors } from 'store/dataRetention';

import { CustomDateRange, DateRange, DateRangeType } from './components';
import { styles } from './dataRetention.styles';
import { useDataRetentionNotifications } from './utils';

interface DataRetentionOwnProps {
  isDisabled?: boolean;
}

export interface DataRetentionStateProps {
  dataRetention?: DataRetention;
  dataRetentionError?: AxiosError;
  dataRetentionFetchStatus?: FetchStatus;
}

type DataRetentionProps = DataRetentionOwnProps;

const DataRetention: React.FC<DataRetentionProps> = ({ isDisabled }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isCustomDateRange, setIsCustomDateRange] = useState(false);
  const [retentionPeriod, setRetentionPeriod] = useState<number>(3);

  const { dataRetention, dataRetentionError, dataRetentionFetchStatus } = useMapToProps();

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
      dataRetentionActions.updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', {
        name: `test: ${value}`,
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
        dataRetentionActions.updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', {
          name: `test: ${newRetentionPeriod}`,
        })
      );
    }
  };

  // Events

  useEffect(() => {
    if (dataRetention && !dataRetentionError && dataRetentionFetchStatus !== FetchStatus.inProgress) {
      const dataRetentionPeriod = 3;

      // Todo: update value when data-retention API is available
      setRetentionPeriod(dataRetentionPeriod);

      const isCustom = dataRetentionPeriod !== 3 && dataRetentionPeriod !== 6 && dataRetentionPeriod !== 12;
      setIsCustomDateRange(isCustom);
    }
  }, [dataRetention, dataRetentionError, dataRetentionFetchStatus]);

  if (dataRetentionError) {
    return <NotAvailable />;
  }

  if (dataRetentionFetchStatus === FetchStatus.inProgress) {
    return (
      <LoadingState
        body={intl.formatMessage(messages.dataRetentionLoadingStateDesc)}
        heading={intl.formatMessage(messages.dataRetentionLoadingStateTitle)}
      />
    );
  }

  return (
    <div style={styles.dateRange}>
      <DateRange
        dateRangeType={isCustomDateRange ? DateRangeType.custom : getDateRangeType(retentionPeriod)}
        isDisabled={isDisabled}
        onSelect={handleOnDateRangeSelect}
      />
      {isCustomDateRange && (
        <div style={styles.customDateRange}>
          <CustomDateRange
            inputValue={retentionPeriod}
            isDisabled={isDisabled}
            onUpdate={handleOnDataRetentionUpdate}
          />
        </div>
      )}
    </div>
  );
};

const useMapToProps = (): DataRetentionStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const dataRetentionQuery = {
    // TBD...
  };
  const dataRetentionQueryString = getQuery(dataRetentionQuery);
  const dataRetention = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetention(state, DataRetentionType.dataRetention, dataRetentionQueryString)
  );
  const dataRetentionError = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetentionError(state, DataRetentionType.dataRetention, dataRetentionQueryString)
  );
  const dataRetentionFetchStatus = useSelector((state: RootState) =>
    dataRetentionSelectors.selectDataRetentionFetchStatus(
      state,
      DataRetentionType.dataRetention,
      dataRetentionQueryString
    )
  );

  useEffect(() => {
    if (!dataRetentionError && dataRetentionFetchStatus !== FetchStatus.inProgress) {
      dispatch(
        dataRetentionActions.fetchDataRetention(DataRetentionType.dataRetention, undefined, dataRetentionQueryString)
      );
    }
  }, [dispatch, dataRetentionError, dataRetentionQueryString]);

  // Notifications disabled for on-prem
  useDataRetentionNotifications(isSettingsDataRetentionPeriodEnabled);

  return {
    dataRetention,
    dataRetentionError,
    dataRetentionFetchStatus,
  };
};

export { DataRetention };
