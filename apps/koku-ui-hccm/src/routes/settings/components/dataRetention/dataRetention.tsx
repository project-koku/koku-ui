import { NumberInput } from '@patternfly/react-core';
import { DataRetention, DataRetentionType } from 'api/dataRetention';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
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

import { isSettingsDataRetentionPeriodEnabled } from '../../../../components/featureToggle';
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

  const [retentionPeriod, setRetentionPeriod] = useState<number | ''>(0);
  const [minValue] = useState<number>(90);
  const [maxValue] = useState<number>(120);

  const { dataRetention, dataRetentionError, dataRetentionFetchStatus } = useMapToProps();

  const normalizeBetween = (value, min, max) => {
    if (min !== undefined && max !== undefined) {
      return Math.max(Math.min(value, max), min);
    } else if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    }
    return value;
  };

  const onMinus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) - 1, minValue, maxValue);
    setRetentionPeriod(newValue);
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const targetValue = (event.target as HTMLInputElement).value;
    setRetentionPeriod((retentionPeriod === '' ? targetValue : +targetValue) as number);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const targetValue = +event.target.value;

    if (targetValue < minValue) {
      setRetentionPeriod(minValue);
    } else if (targetValue > maxValue) {
      setRetentionPeriod(maxValue);
    }
  };

  const onPlus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) + 1, minValue, maxValue);
    setRetentionPeriod(newValue);
  };

  // Events

  useEffect(() => {
    if (dataRetention && !dataRetentionError && dataRetentionFetchStatus !== FetchStatus.inProgress) {
      // Todo: update value when data-retention API is available
      const newValue = normalizeBetween(90, minValue, maxValue);
      setRetentionPeriod(newValue);
    }
  }, [dataRetention, dataRetentionError, dataRetentionFetchStatus]);

  useEffect(() => {
    // Todo: update when data-retention API is available
    if (retentionPeriod !== '') {
      onRetentionPeriodUpdate?.(retentionPeriod);
      dispatch(
        dataRetentionActions.updateDataRetention(DataRetentionType.dataRetentionUpdate, 'test', {
          name: 'test',
        })
      );
    }
  }, [retentionPeriod]);

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
          onMinus={onMinus}
          onChange={onChange}
          onBlur={onBlur}
          onPlus={onPlus}
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
