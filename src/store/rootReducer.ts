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
import { exportReducer, exportStateKey } from 'store/exports';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import { reportReducer, reportStateKey } from 'store/reports';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { StateType } from 'typesafe-actions';
import { metricsReducer, metricsStateKey } from './metrics';
import { providersReducer, providersStateKey } from './providers';
import { rbacReducer, rbacStateKey } from './rbac';
import { uiReducer, uiStateKey } from './ui';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsCloudDashboardStateKey]: awsCloudDashboardReducer,
  [awsDashboardStateKey]: awsDashboardReducer,
  [azureCloudDashboardStateKey]: azureCloudDashboardReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [exportStateKey]: exportReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [reportStateKey]: reportReducer,
  [sourcesStateKey]: sourcesReducer,
  [costModelsStateKey]: costModelsReducer,
  [uiStateKey]: uiReducer,
  [metricsStateKey]: metricsReducer,
  [rbacStateKey]: rbacReducer,
  notifications,
});
