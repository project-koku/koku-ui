import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { sessionReducer, sessionStateKey } from './session';
import { uiReducer, uiStateKey } from './ui';
import { usersReducer, usersStateKey } from './users';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [sessionStateKey]: sessionReducer,
  [usersStateKey]: usersReducer,
  [uiStateKey]: uiReducer,
});
