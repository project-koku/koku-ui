import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { combineReducers } from 'redux';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import {
  awsCloudDashboardReducer,
  awsCloudDashboardStateKey,
} from 'store/dashboard/awsCloudDashboard';
import {
  awsDashboardReducer,
  awsDashboardStateKey,
} from 'store/dashboard/awsDashboard';
import {
  azureCloudDashboardReducer,
  azureCloudDashboardStateKey,
} from 'store/dashboard/azureCloudDashboard';
import {
  azureDashboardReducer,
  azureDashboardStateKey,
} from 'store/dashboard/azureDashboard';
import {
  ocpCloudDashboardReducer,
  ocpCloudDashboardStateKey,
} from 'store/dashboard/ocpCloudDashboard';
import {
  ocpDashboardReducer,
  ocpDashboardStateKey,
} from 'store/dashboard/ocpDashboard';
import {
  ocpSupplementaryDashboardReducer,
  ocpSupplementaryDashboardStateKey,
} from 'store/dashboard/ocpSupplementaryDashboard';
import {
  ocpUsageDashboardReducer,
  ocpUsageDashboardStateKey,
} from 'store/dashboard/ocpUsageDashboard';
import { awsExportReducer, awsExportStateKey } from 'store/export/awsExport';
import {
  azureExportReducer,
  azureExportStateKey,
} from 'store/export/azureExport';
import {
  ocpCloudExportReducer,
  ocpCloudExportStateKey,
} from 'store/export/ocpCloudExport';
import { ocpExportReducer, ocpExportStateKey } from 'store/export/ocpExport';
import { onboardingReducer, onboardingStateKey } from 'store/onboarding';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { StateType } from 'typesafe-actions';
import { awsReportsReducer, awsReportsStateKey } from './awsReports';
import { azureReportsReducer, azureReportsStateKey } from './azureReports';
import { metricsReducer, metricsStateKey } from './metrics';
import {
  ocpCloudReportsReducer,
  ocpCloudReportsStateKey,
} from './ocpCloudReports';
import { ocpReportsReducer, ocpReportsStateKey } from './ocpReports';
import { providersReducer, providersStateKey } from './providers';
import { uiReducer, uiStateKey } from './ui';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsCloudDashboardStateKey]: awsCloudDashboardReducer,
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsExportStateKey]: awsExportReducer,
  [awsReportsStateKey]: awsReportsReducer,
  [azureCloudDashboardStateKey]: azureCloudDashboardReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [azureExportStateKey]: azureExportReducer,
  [azureReportsStateKey]: azureReportsReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpExportStateKey]: ocpExportReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpCloudExportStateKey]: ocpCloudExportReducer,
  [ocpCloudReportsStateKey]: ocpCloudReportsReducer,
  [ocpReportsStateKey]: ocpReportsReducer,
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [sourcesStateKey]: sourcesReducer,
  [costModelsStateKey]: costModelsReducer,
  [uiStateKey]: uiReducer,
  [onboardingStateKey]: onboardingReducer,
  [metricsStateKey]: metricsReducer,
  notifications,
});
