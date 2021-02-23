import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { combineReducers } from 'redux';
import { awsCostOverviewReducer, awsCostOverviewStateKey } from 'store/breakdown/costOverview/awsCostOverview';
import { azureCostOverviewReducer, azureCostOverviewStateKey } from 'store/breakdown/costOverview/azureCostOverview';
import { gcpCostOverviewReducer, gcpCostOverviewStateKey } from 'store/breakdown/costOverview/gcpCostOverview';
import { ocpCostOverviewReducer, ocpCostOverviewStateKey } from 'store/breakdown/costOverview/ocpCostOverview';
import { awsHistoricalDataReducer, awsHistoricalDataStateKey } from 'store/breakdown/historicalData/awsHistoricalData';
import {
  azureHistoricalDataReducer,
  azureHistoricalDataStateKey,
} from 'store/breakdown/historicalData/azureHistoricalData';
import { gcpHistoricalDataReducer, gcpHistoricalDataStateKey } from 'store/breakdown/historicalData/gcpHistoricalData';
import { ocpHistoricalDataReducer, ocpHistoricalDataStateKey } from 'store/breakdown/historicalData/ocpHistoricalData';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
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
import { orgReducer, orgStateKey } from 'store/orgs';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import { reportReducer, reportStateKey } from 'store/reports';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { tagReducer, tagStateKey } from 'store/tags';
import { StateType } from 'typesafe-actions';

import { metricsReducer, metricsStateKey } from './metrics';
import { providersReducer, providersStateKey } from './providers';
import { rbacReducer, rbacStateKey } from './rbac';
import { uiReducer, uiStateKey } from './ui';
import { userAccessReducer, userAccessStateKey } from './userAccess';

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
  [costModelsStateKey]: costModelsReducer,
  [exportStateKey]: exportReducer,
  [gcpCostOverviewStateKey]: gcpCostOverviewReducer,
  [gcpDashboardStateKey]: gcpDashboardReducer,
  [gcpHistoricalDataStateKey]: gcpHistoricalDataReducer,
  [metricsStateKey]: metricsReducer,
  [ocpCostOverviewStateKey]: ocpCostOverviewReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpHistoricalDataStateKey]: ocpHistoricalDataReducer,
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
  [orgStateKey]: orgReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [rbacStateKey]: rbacReducer,
  [reportStateKey]: reportReducer,
  [forecastStateKey]: forecastReducer,
  [sourcesStateKey]: sourcesReducer,
  [tagStateKey]: tagReducer,
  [uiStateKey]: uiReducer,
  [userAccessStateKey]: userAccessReducer,
  notifications,
});
