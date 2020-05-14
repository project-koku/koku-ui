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
import {
  awsDetailsReducer,
  awsDetailsStateKey,
} from 'store/details/awsDetails';
import {
  azureDetailsReducer,
  azureDetailsStateKey,
} from 'store/details/azureDetails';
import {
  ocpDetailsReducer,
  ocpDetailsStateKey,
} from 'store/details/ocpDetails';
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
  [awsDetailsStateKey]: awsDetailsReducer,
  [azureCloudDashboardStateKey]: azureCloudDashboardReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [azureDetailsStateKey]: azureDetailsReducer,
  [exportStateKey]: exportReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpDetailsStateKey]: ocpDetailsReducer,
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
