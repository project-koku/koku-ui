import { combineReducers } from 'redux';
import { StateType } from 'typesafe-actions';
import { awsDashboardReducer, awsDashboardStateKey } from './awsDashboard';
import { exportReducer, exportStateKey } from './export';
import { ocpDashboardReducer, ocpDashboardStateKey } from './ocpDashboard';
import { providersReducer, providersStateKey } from './providers';
import { reportsReducer, reportsStateKey } from './reports';
import { sessionReducer, sessionStateKey } from './session';
import { uiReducer, uiStateKey } from './ui';
import { usersReducer, usersStateKey } from './users';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsDashboardStateKey]: awsDashboardReducer,
  [exportStateKey]: exportReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [providersStateKey]: providersReducer,
  [reportsStateKey]: reportsReducer,
  [sessionStateKey]: sessionReducer,
  [usersStateKey]: usersReducer,
  [uiStateKey]: uiReducer,
});
