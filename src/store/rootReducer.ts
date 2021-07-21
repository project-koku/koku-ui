import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { combineReducers } from 'redux';
import { awsCostOverviewReducer, awsCostOverviewStateKey } from 'store/breakdown/costOverview/awsCostOverview';
import { azureCostOverviewReducer, azureCostOverviewStateKey } from 'store/breakdown/costOverview/azureCostOverview';
import { gcpCostOverviewReducer, gcpCostOverviewStateKey } from 'store/breakdown/costOverview/gcpCostOverview';
import { ibmCostOverviewReducer, ibmCostOverviewStateKey } from 'store/breakdown/costOverview/ibmCostOverview';
import { ocpCostOverviewReducer, ocpCostOverviewStateKey } from 'store/breakdown/costOverview/ocpCostOverview';
import { awsHistoricalDataReducer, awsHistoricalDataStateKey } from 'store/breakdown/historicalData/awsHistoricalData';
import {
  azureHistoricalDataReducer,
  azureHistoricalDataStateKey,
} from 'store/breakdown/historicalData/azureHistoricalData';
import { gcpHistoricalDataReducer, gcpHistoricalDataStateKey } from 'store/breakdown/historicalData/gcpHistoricalData';
import { ibmHistoricalDataReducer, ibmHistoricalDataStateKey } from 'store/breakdown/historicalData/ibmHistoricalData';
import { ocpHistoricalDataReducer, ocpHistoricalDataStateKey } from 'store/breakdown/historicalData/ocpHistoricalData';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { awsDashboardReducer, awsDashboardStateKey } from 'store/dashboard/awsDashboard';
import { awsOcpDashboardReducer, awsOcpDashboardStateKey } from 'store/dashboard/awsOcpDashboard';
import { azureDashboardReducer, azureDashboardStateKey } from 'store/dashboard/azureDashboard';
import { azureOcpDashboardReducer, azureOcpDashboardStateKey } from 'store/dashboard/azureOcpDashboard';
import { gcpDashboardReducer, gcpDashboardStateKey } from 'store/dashboard/gcpDashboard';
import { gcpOcpDashboardReducer, gcpOcpDashboardStateKey } from 'store/dashboard/gcpOcpDashboard';
import { ibmDashboardReducer, ibmDashboardStateKey } from 'store/dashboard/ibmDashboard';
import { ocpCloudDashboardReducer, ocpCloudDashboardStateKey } from 'store/dashboard/ocpCloudDashboard';
import { ocpDashboardReducer, ocpDashboardStateKey } from 'store/dashboard/ocpDashboard';
import {
  ocpInfrastructureDashboardReducer,
  ocpInfrastructureDashboardStateKey,
} from 'store/dashboard/ocpInfrastructureDashboard';
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
import { resourceReducer, resourceStateKey } from 'store/resources';
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
  [awsOcpDashboardStateKey]: awsOcpDashboardReducer,
  [awsCostOverviewStateKey]: awsCostOverviewReducer,
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsHistoricalDataStateKey]: awsHistoricalDataReducer,
  [azureOcpDashboardStateKey]: azureOcpDashboardReducer,
  [azureCostOverviewStateKey]: azureCostOverviewReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [azureHistoricalDataStateKey]: azureHistoricalDataReducer,
  [costModelsStateKey]: costModelsReducer,
  [exportStateKey]: exportReducer,
  [gcpCostOverviewStateKey]: gcpCostOverviewReducer,
  [gcpDashboardStateKey]: gcpDashboardReducer,
  [gcpOcpDashboardStateKey]: gcpOcpDashboardReducer,
  [gcpHistoricalDataStateKey]: gcpHistoricalDataReducer,
  [ibmCostOverviewStateKey]: ibmCostOverviewReducer,
  [ibmDashboardStateKey]: ibmDashboardReducer,
  [ibmHistoricalDataStateKey]: ibmHistoricalDataReducer,
  [metricsStateKey]: metricsReducer,
  [ocpCostOverviewStateKey]: ocpCostOverviewReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpHistoricalDataStateKey]: ocpHistoricalDataReducer,
  [ocpInfrastructureDashboardStateKey]: ocpInfrastructureDashboardReducer,
  [ocpSupplementaryDashboardStateKey]: ocpSupplementaryDashboardReducer,
  [ocpUsageDashboardStateKey]: ocpUsageDashboardReducer,
  [orgStateKey]: orgReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [rbacStateKey]: rbacReducer,
  [reportStateKey]: reportReducer,
  [forecastStateKey]: forecastReducer,
  [resourceStateKey]: resourceReducer,
  [sourcesStateKey]: sourcesReducer,
  [tagStateKey]: tagReducer,
  [uiStateKey]: uiReducer,
  [userAccessStateKey]: userAccessReducer,
  notifications,
});
