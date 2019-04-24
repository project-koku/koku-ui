import { combineReducers } from 'redux';
import { onboardingReducer, onboardingStateKey } from 'store/onboarding';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import {
  deleteDialogReducer,
  deleteDialogStateKey,
} from 'store/sourceDeleteDialog';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { StateType } from 'typesafe-actions';
import { awsDashboardReducer, awsDashboardStateKey } from './awsDashboard';
import { awsDetailsReducer, awsDetailsStateKey } from './awsDetails';
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

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsDetailsStateKey]: awsDetailsReducer,
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
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [sessionStateKey]: sessionReducer,
  [sourcesStateKey]: sourcesReducer,
  [deleteDialogStateKey]: deleteDialogReducer,
  [uiStateKey]: uiReducer,
  [onboardingStateKey]: onboardingReducer,
});
