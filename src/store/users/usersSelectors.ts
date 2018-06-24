import { RootState } from '../rootReducer';
import { stateKey } from './usersReducer';

export const selectUsersState = (state: RootState) => state[stateKey];

export const selectUsersMap = (state: RootState) =>
  selectUsersState(state).byId;

export const selectUsersFetchStatusMap = (state: RootState) =>
  selectUsersState(state).fetchStatus;

export const selectUsersErrorMap = (state: RootState) =>
  selectUsersState(state).errors;

export const selectCurrentUser = (state: RootState) =>
  selectUsersMap(state).get('current');

export const selectCurrentUserFetchStatus = (state: RootState) =>
  selectUsersFetchStatusMap(state).get('current');

export const selectCurrentUserError = (state: RootState) =>
  selectUsersErrorMap(state).get('current');
