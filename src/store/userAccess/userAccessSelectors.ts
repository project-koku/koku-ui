import { UserAccessType } from 'api/userAccess';
import { RootState } from 'store/rootReducer';

import { getReportId, stateKey, userAccessKey } from './userAccessCommon';

export const selectUserAccessState = (state: RootState) => state[stateKey];

// Add provider

export const selectAddProviderFetchStatus = (state: RootState) =>
  selectUserAccessState(state).fetchStatus.get(userAccessKey);

export const selectAddProviderError = (state: RootState) => selectUserAccessState(state).errors.get(userAccessKey);

// Fetch userAccess

export const selectUserAccess = (state: RootState, providerType: UserAccessType, query: string) =>
  selectUserAccessState(state).byId.get(getReportId(providerType, query));

export const selectUserAccessFetchStatus = (state: RootState, providerType: UserAccessType, query: string) =>
  selectUserAccessState(state).fetchStatus.get(getReportId(providerType, query));

export const selectUserAccessError = (state: RootState, providerType: UserAccessType, query: string) =>
  selectUserAccessState(state).errors.get(getReportId(providerType, query));
