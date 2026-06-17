import { NumberInput } from '@patternfly/react-core';
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

import { useDataRetentionNotifications } from './utils';

interface DataRetentionOwnProps {
  isDisabled?: boolean;
  onRetentionPeriodUpdate?: (value: number) => void;
}

export interface DataRetentionStateProps {
  dataRetention?: DataRetention;
  dataRetentionError?: AxiosError;
  dataRetentionFetchStatus?: FetchStatus;
}

type DataRetentionProps = DataRetentionOwnProps;

const DataRetention: React.FC<DataRetentionProps> = ({ isDisabled, onRetentionPeriodUpdate }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const maxValue = 120;
  const minValue = 90;
  const [retentionPeriod, setRetentionPeriod] = useState<number | ''>(minValue);

  const { dataRetention, dataRetentionError, dataRetentionFetchStatus } = useMapToProps();

  const normalizeBetween = (value: number, min: number, max: number): number => {
    if (min !== undefined && max !== undefined) {
      return Math.max(Math.min(value, max), min);
    } else if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    }
    return value;
  };

  // Handlers

  const handleRetentionPeriodUpdate = (value: number) => {
    onRetentionPeriodUpdate?.(value);
    dispatch(
      dataRetentionActions.updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', {
        name: 'test',
      })
    );
  };

  const handleOnMinus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) - 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    handleRetentionPeriodUpdate(newValue);
  };

  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const targetValue = (event.target as HTMLInputElement).value;
    setRetentionPeriod(targetValue === '' ? '' : +targetValue);
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const targetValue = +event.target.value;
    const clampedValue = isNaN(targetValue) ? minValue : normalizeBetween(targetValue, minValue, maxValue);
    setRetentionPeriod(clampedValue);
    handleRetentionPeriodUpdate(clampedValue);
  };

  const handleOnPlus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) + 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    handleRetentionPeriodUpdate(newValue);
  };

  // Events

  useEffect(() => {
    if (dataRetention && !dataRetentionError && dataRetentionFetchStatus !== FetchStatus.inProgress) {
      // Todo: update value when data-retention API is available
      const newValue = normalizeBetween(90, minValue, maxValue);
      setRetentionPeriod(newValue);
    }
  }, [dataRetention, dataRetentionError, dataRetentionFetchStatus]);

  if (dataRetentionError) {
    return <NotAvailable />;
  }

  return (
    <>
      {dataRetentionFetchStatus === FetchStatus.inProgress ? (
        <LoadingState
          body={intl.formatMessage(messages.dataRetentionLoadingStateDesc)}
          heading={intl.formatMessage(messages.dataRetentionLoadingStateTitle)}
        />
      ) : (
        <NumberInput
          inputAriaLabel={intl.formatMessage(messages.dataRetentionInputAriaLabel)}
          inputName="data-retention-period"
          isDisabled={isDisabled}
          max={maxValue}
          min={minValue}
          minusBtnAriaLabel={intl.formatMessage(messages.dataRetentionMinusBtnAriaLabel)}
          onMinus={handleOnMinus}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onPlus={handleOnPlus}
          plusBtnAriaLabel={intl.formatMessage(messages.dataRetentionPlusBtnAriaLabel)}
          value={retentionPeriod}
        />
      )}
    </>
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
