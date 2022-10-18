import { RootState } from 'store/rootReducer';
import { stateKey } from './sessionReducer';

export const selectSessionState = (state: RootState) => state[stateKey];

export const selectIsLoggedIn = (state: RootState) =>
  Boolean(selectSessionState(state).token);

export const selectLoginFetchStatus = (state: RootState) =>
  selectSessionState(state).loginFetchStatus;

export const selectLoginError = (state: RootState) =>
  selectSessionState(state).loginError;
