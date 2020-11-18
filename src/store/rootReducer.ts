import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { combineReducers } from 'redux';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { awsCostOverviewReducer, awsCostOverviewStateKey } from 'store/costOverview/awsCostOverview';
import { azureCostOverviewReducer, azureCostOverviewStateKey } from 'store/costOverview/azureCostOverview';
import { gcpCostOverviewReducer, gcpCostOverviewStateKey } from 'store/costOverview/gcpCostOverview';
import { ocpCostOverviewReducer, ocpCostOverviewStateKey } from 'store/costOverview/ocpCostOverview';
import { awsCloudDashboardReducer, awsCloudDashboardStateKey } from 'store/dashboard/awsCloudDashboard';
import { awsDashboardReducer, awsDashboardStateKey } from 'store/dashboard/awsDashboard';
import { azureCloudDashboardReducer, azureCloudDashboardStateKey } from 'store/dashboard/azureCloudDashboard';
import { azureDashboardReducer, azureDashboardStateKey } from 'store/dashboard/azureDashboard';
import { gcpDashboardReducer, gcpDashboardStateKey } from 'store/dashboard/gcpDashboard';
import { ocpCloudDashboardReducer, ocpCloudDashboardStateKey } from 'store/dashboard/ocpCloudDashboard';
import { ocpDashboardReducer, ocpDashboardStateKey } from 'store/dashboard/ocpDashboard';
import {
  ocpSupplementaryDashboardReducer,
  ocpSupplementaryDashboardStateKey,
} from 'store/dashboard/ocpSupplementaryDashboard';
import { ocpUsageDashboardReducer, ocpUsageDashboardStateKey } from 'store/dashboard/ocpUsageDashboard';
import { exportReducer, exportStateKey } from 'store/exports';
import { forecastReducer, forecastStateKey } from 'store/forecasts';
import { awsHistoricalDataReducer, awsHistoricalDataStateKey } from 'store/historicalData/awsHistoricalData';
import { azureHistoricalDataReducer, azureHistoricalDataStateKey } from 'store/historicalData/azureHistoricalData';
import { gcpHistoricalDataReducer, gcpHistoricalDataStateKey } from 'store/historicalData/gcpHistoricalData';
import { ocpHistoricalDataReducer, ocpHistoricalDataStateKey } from 'store/historicalData/ocpHistoricalData';
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
  [awsCostOverviewStateKey]: awsCostOverviewReducer,
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsHistoricalDataStateKey]: awsHistoricalDataReducer,
  [azureCloudDashboardStateKey]: azureCloudDashboardReducer,
  [azureCostOverviewStateKey]: azureCostOverviewReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [azureHistoricalDataStateKey]: azureHistoricalDataReducer,
  [exportStateKey]: exportReducer,
  [gcpCostOverviewStateKey]: gcpCostOverviewReducer,
  [gcpDashboardStateKey]: gcpDashboardReducer,
  [gcpHistoricalDataStateKey]: gcpHistoricalDataReducer,
  [ocpCostOverviewStateKey]: ocpCostOverviewReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpHistoricalDataStateKey]: ocpHistoricalDataReducer,
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [reportStateKey]: reportReducer,
  [forecastStateKey]: forecastReducer,
  [sourcesStateKey]: sourcesReducer,
  [costModelsStateKey]: costModelsReducer,
  [uiStateKey]: uiReducer,
  [metricsStateKey]: metricsReducer,
  [rbacStateKey]: rbacReducer,
  notifications,
});
