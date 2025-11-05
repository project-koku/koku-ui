import type { UserAccessType } from 'api/userAccess';
import type { RootState } from 'store/rootReducer';

import { getFetchId, stateKey } from './userAccessCommon';

export const selectUserAccessState = (state: RootState) => state[stateKey];

// Fetch userAccess

export const selectUserAccess = (state: RootState, providerType: UserAccessType, providerQueryString: string) =>
  selectUserAccessState(state).byId.get(getFetchId(providerType, providerQueryString));

export const selectUserAccessFetchStatus = (
  state: RootState,
  userAccessType: UserAccessType,
  userAccessQueryString: string
) => selectUserAccessState(state).fetchStatus.get(getFetchId(userAccessType, userAccessQueryString));

export const selectUserAccessError = (
  state: RootState,
  userAccessType: UserAccessType,
  userAccessQueryString: string
) => selectUserAccessState(state).errors.get(getFetchId(userAccessType, userAccessQueryString));
