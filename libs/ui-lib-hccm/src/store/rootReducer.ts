import { combineReducers, type Reducer, type StateFromReducersMapObject, type UnknownAction } from 'redux';

import { accountSettingsReducer, accountSettingsStateKey } from './accountSettings';
import { awsCostOverviewReducer, awsCostOverviewStateKey } from './breakdown/costOverview/awsCostOverview';
import { azureCostOverviewReducer, azureCostOverviewStateKey } from './breakdown/costOverview/azureCostOverview';
import { gcpCostOverviewReducer, gcpCostOverviewStateKey } from './breakdown/costOverview/gcpCostOverview';
import { ocpCostOverviewReducer, ocpCostOverviewStateKey } from './breakdown/costOverview/ocpCostOverview';
import { awsHistoricalDataReducer, awsHistoricalDataStateKey } from './breakdown/historicalData/awsHistoricalData';
import {
  azureHistoricalDataReducer,
  azureHistoricalDataStateKey,
} from './breakdown/historicalData/azureHistoricalData';
import { gcpHistoricalDataReducer, gcpHistoricalDataStateKey } from './breakdown/historicalData/gcpHistoricalData';
import { ocpHistoricalDataReducer, ocpHistoricalDataStateKey } from './breakdown/historicalData/ocpHistoricalData';
import { costModelsReducer, costModelsStateKey } from './costModels';
import { awsDashboardReducer, awsDashboardStateKey } from './dashboard/awsDashboard';
import { awsOcpDashboardReducer, awsOcpDashboardStateKey } from './dashboard/awsOcpDashboard';
import { azureDashboardReducer, azureDashboardStateKey } from './dashboard/azureDashboard';
import { azureOcpDashboardReducer, azureOcpDashboardStateKey } from './dashboard/azureOcpDashboard';
import { gcpDashboardReducer, gcpDashboardStateKey } from './dashboard/gcpDashboard';
import { gcpOcpDashboardReducer, gcpOcpDashboardStateKey } from './dashboard/gcpOcpDashboard';
import { ocpCloudDashboardReducer, ocpCloudDashboardStateKey } from './dashboard/ocpCloudDashboard';
import { ocpDashboardReducer, ocpDashboardStateKey } from './dashboard/ocpDashboard';
import { exportReducer, exportStateKey } from './export';
import { FeatureToggleReducer, FeatureToggleStateKey } from './featureToggle';
import { forecastReducer, forecastStateKey } from './forecasts';
import { metricsReducer, metricsStateKey } from './metrics';
import { orgReducer, orgStateKey } from './orgs';
import { priceListReducer, priceListStateKey } from './priceList';
import { providersReducer, providersStateKey } from './providers';
import { rbacReducer, rbacStateKey } from './rbac';
import { reportReducer, reportStateKey } from './reports';
import { resourceReducer, resourceStateKey } from './resources';
import { settingsReducer, settingsStateKey } from './settings';
import { sourcesReducer, sourcesStateKey } from './sourceSettings';
import { tagReducer, tagStateKey } from './tags';
import { uiReducer, uiStateKey } from './ui';
import { userAccessReducer, userAccessStateKey } from './userAccess';

const reducersMap = {
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
};

const rootReducerInternal = combineReducers(reducersMap);
export type RootState = StateFromReducersMapObject<typeof reducersMap>;
export const rootReducer: Reducer<RootState, UnknownAction> = rootReducerInternal;
