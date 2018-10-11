import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { dashboardReducer, dashboardStateKey } from './dashboard';
import { exportReducer, exportStateKey } from './export';
import { providersReducer, providersStateKey } from './providers';
import { reportsReducer, reportsStateKey } from './reports';
import { sessionReducer, sessionStateKey } from './session';
import { uiReducer, uiStateKey } from './ui';
import { usersReducer, usersStateKey } from './users';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [sessionStateKey]: sessionReducer,
  [usersStateKey]: usersReducer,
  [uiStateKey]: uiReducer,
  [reportsStateKey]: reportsReducer,
  [dashboardStateKey]: dashboardReducer,
  [exportStateKey]: exportReducer,
  [providersStateKey]: providersReducer,
});
