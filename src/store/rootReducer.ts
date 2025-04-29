import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { combineReducers } from 'redux';
import { accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
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
import { awsDashboardReducer, awsDashboardStateKey } from 'store/dashboard/awsDashboard';
import { awsOcpDashboardReducer, awsOcpDashboardStateKey } from 'store/dashboard/awsOcpDashboard';
import { azureDashboardReducer, azureDashboardStateKey } from 'store/dashboard/azureDashboard';
import { azureOcpDashboardReducer, azureOcpDashboardStateKey } from 'store/dashboard/azureOcpDashboard';
import { gcpDashboardReducer, gcpDashboardStateKey } from 'store/dashboard/gcpDashboard';
import { gcpOcpDashboardReducer, gcpOcpDashboardStateKey } from 'store/dashboard/gcpOcpDashboard';
import { ocpCloudDashboardReducer, ocpCloudDashboardStateKey } from 'store/dashboard/ocpCloudDashboard';
import { ocpDashboardReducer, ocpDashboardStateKey } from 'store/dashboard/ocpDashboard';
import { exportReducer, exportStateKey } from 'store/export';
import { forecastReducer, forecastStateKey } from 'store/forecasts';
import { orgReducer, orgStateKey } from 'store/orgs';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import { reportReducer, reportStateKey } from 'store/reports';
import { resourceReducer, resourceStateKey } from 'store/resources';
import { settingsReducer, settingsStateKey } from 'store/settings';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { tagReducer, tagStateKey } from 'store/tags';
import type { StateType } from 'typesafe-actions';

import { FeatureToggleReducer, FeatureToggleStateKey } from './featureToggle';
import { metricsReducer, metricsStateKey } from './metrics';
import { providersReducer, providersStateKey } from './providers';
import { rbacReducer, rbacStateKey } from './rbac';
import { uiReducer, uiStateKey } from './ui';
import { userAccessReducer, userAccessStateKey } from './userAccess';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [accountSettingsStateKey]: accountSettingsReducer,
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
  [FeatureToggleStateKey]: FeatureToggleReducer,
  [forecastStateKey]: forecastReducer,
  [gcpCostOverviewStateKey]: gcpCostOverviewReducer,
  [gcpDashboardStateKey]: gcpDashboardReducer,
  [gcpOcpDashboardStateKey]: gcpOcpDashboardReducer,
  [gcpHistoricalDataStateKey]: gcpHistoricalDataReducer,
  [metricsStateKey]: metricsReducer,
  [ocpCostOverviewStateKey]: ocpCostOverviewReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpCloudDashboardStateKey]: ocpCloudDashboardReducer,
  [ocpHistoricalDataStateKey]: ocpHistoricalDataReducer,
  [orgStateKey]: orgReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [rbacStateKey]: rbacReducer,
  [reportStateKey]: reportReducer,
  [resourceStateKey]: resourceReducer,
  [settingsStateKey]: settingsReducer,
  [sourcesStateKey]: sourcesReducer,
  [tagStateKey]: tagReducer,
  [uiStateKey]: uiReducer,
  [userAccessStateKey]: userAccessReducer,
  notifications: notificationsReducer,
});
