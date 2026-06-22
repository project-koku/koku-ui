import type { DataRetentionType } from 'api/dataRetention';
import type { RootState } from 'store/rootReducer';

import { dataRetentionStateKey, getFetchId } from './dataRetentionCommon';

export const selectDataRetentionState = (state: RootState) => state[dataRetentionStateKey];

export const selectDataRetention = (state: RootState, dataRetentionType: DataRetentionType, queryString: string) =>
  selectDataRetentionState(state).byId.get(getFetchId(dataRetentionType, queryString));

export const selectDataRetentionError = (state: RootState, dataRetentionType: DataRetentionType, queryString: string) =>
  selectDataRetentionState(state)?.errors.get(getFetchId(dataRetentionType, queryString));

export const selectDataRetentionFetchStatus = (
  state: RootState,
  dataRetentionType: DataRetentionType,
  queryString: string
) => selectDataRetentionState(state)?.status.get(getFetchId(dataRetentionType, queryString));

export const selectDataRetentionNotification = (
  state: RootState,
  dataRetentionType: DataRetentionType,
  queryString: string
) => selectDataRetentionState(state)?.notification?.get(getFetchId(dataRetentionType, queryString));
