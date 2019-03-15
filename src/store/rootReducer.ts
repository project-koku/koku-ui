import { combineReducers } from 'redux';
import { onboardingReducer, onboardingStateKey } from 'store/onboarding';
import { StateType } from 'typesafe-actions';
import { awsDashboardReducer, awsDashboardStateKey } from './awsDashboard';
import { awsExportReducer, awsExportStateKey } from './awsExport';
import { awsReportsReducer, awsReportsStateKey } from './awsReports';
import { ocpDashboardReducer, ocpDashboardStateKey } from './ocpDashboard';
import { ocpExportReducer, ocpExportStateKey } from './ocpExport';
import {
  ocpOnAwsDashboardReducer,
  ocpOnAwsDashboardStateKey,
} from './ocpOnAwsDashboard';
import {
  ocpOnAwsDetailsReducer,
  ocpOnAwsDetailsStateKey,
} from './ocpOnAwsDetails';
import {
  ocpOnAwsExportReducer,
  ocpOnAwsExportStateKey,
} from './ocpOnAwsExport';
import {
  ocpOnAwsReportsReducer,
  ocpOnAwsReportsStateKey,
} from './ocpOnAwsReports';
import { ocpReportsReducer, ocpReportsStateKey } from './ocpReports';
import { providersReducer, providersStateKey } from './providers';
import { sessionReducer, sessionStateKey } from './session';
import { uiReducer, uiStateKey } from './ui';
import { usersReducer, usersStateKey } from './users';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsExportStateKey]: awsExportReducer,
  [awsReportsStateKey]: awsReportsReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpExportStateKey]: ocpExportReducer,
  [ocpOnAwsDashboardStateKey]: ocpOnAwsDashboardReducer,
  [ocpOnAwsDashboardStateKey]: ocpOnAwsDashboardReducer,
  [ocpOnAwsDetailsStateKey]: ocpOnAwsDetailsReducer,
  [ocpOnAwsExportStateKey]: ocpOnAwsExportReducer,
  [ocpOnAwsReportsStateKey]: ocpOnAwsReportsReducer,
  [ocpReportsStateKey]: ocpReportsReducer,
  [providersStateKey]: providersReducer,
  [sessionStateKey]: sessionReducer,
  [usersStateKey]: usersReducer,
  [uiStateKey]: uiReducer,
  [onboardingStateKey]: onboardingReducer,
});
