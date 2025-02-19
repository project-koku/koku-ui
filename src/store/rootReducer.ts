import { notificationsReducer } from '@ausuliv/frontend-components-notifications/redux';
import { combineReducers } from 'redux';
import { accountSettingsReducer, accountSettingsStateKey } from 'store/accountSettings';
import { awsCostOverviewReducer, awsCostOverviewStateKey } from 'store/breakdown/costOverview/awsCostOverview';
import { azureCostOverviewReducer, azureCostOverviewStateKey } from 'store/breakdown/costOverview/azureCostOverview';
import { gcpCostOverviewReducer, gcpCostOverviewStateKey } from 'store/breakdown/costOverview/gcpCostOverview';
import { ibmCostOverviewReducer, ibmCostOverviewStateKey } from 'store/breakdown/costOverview/ibmCostOverview';
import { ociCostOverviewReducer, ociCostOverviewStateKey } from 'store/breakdown/costOverview/ociCostOverview';
import { ocpCostOverviewReducer, ocpCostOverviewStateKey } from 'store/breakdown/costOverview/ocpCostOverview';
import { rhelCostOverviewReducer, rhelCostOverviewStateKey } from 'store/breakdown/costOverview/rhelCostOverview';
import { awsHistoricalDataReducer, awsHistoricalDataStateKey } from 'store/breakdown/historicalData/awsHistoricalData';
import {
  azureHistoricalDataReducer,
  azureHistoricalDataStateKey,
} from 'store/breakdown/historicalData/azureHistoricalData';
import { gcpHistoricalDataReducer, gcpHistoricalDataStateKey } from 'store/breakdown/historicalData/gcpHistoricalData';
import { ibmHistoricalDataReducer, ibmHistoricalDataStateKey } from 'store/breakdown/historicalData/ibmHistoricalData';
import { ociHistoricalDataReducer, ociHistoricalDataStateKey } from 'store/breakdown/historicalData/ociHistoricalData';
import { ocpHistoricalDataReducer, ocpHistoricalDataStateKey } from 'store/breakdown/historicalData/ocpHistoricalData';
import {
  rhelHistoricalDataReducer,
  rhelHistoricalDataStateKey,
} from 'store/breakdown/historicalData/rhelHistoricalData';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { awsDashboardReducer, awsDashboardStateKey } from 'store/dashboard/awsDashboard';
import { awsOcpDashboardReducer, awsOcpDashboardStateKey } from 'store/dashboard/awsOcpDashboard';
import { azureDashboardReducer, azureDashboardStateKey } from 'store/dashboard/azureDashboard';
import { azureOcpDashboardReducer, azureOcpDashboardStateKey } from 'store/dashboard/azureOcpDashboard';
import { gcpDashboardReducer, gcpDashboardStateKey } from 'store/dashboard/gcpDashboard';
import { gcpOcpDashboardReducer, gcpOcpDashboardStateKey } from 'store/dashboard/gcpOcpDashboard';
import { ibmDashboardReducer, ibmDashboardStateKey } from 'store/dashboard/ibmDashboard';
import { ociDashboardReducer, ociDashboardStateKey } from 'store/dashboard/ociDashboard';
import { ocpCloudDashboardReducer, ocpCloudDashboardStateKey } from 'store/dashboard/ocpCloudDashboard';
import { ocpDashboardReducer, ocpDashboardStateKey } from 'store/dashboard/ocpDashboard';
import { rhelDashboardReducer, rhelDashboardStateKey } from 'store/dashboard/rhelDashboard';
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
  [ociCostOverviewStateKey]: ociCostOverviewReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [ociDashboardStateKey]: ociDashboardReducer,
  [azureHistoricalDataStateKey]: azureHistoricalDataReducer,
  [ociHistoricalDataStateKey]: ociHistoricalDataReducer,
  [costModelsStateKey]: costModelsReducer,
  [exportStateKey]: exportReducer,
  [FeatureToggleStateKey]: FeatureToggleReducer,
  [forecastStateKey]: forecastReducer,
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
  [orgStateKey]: orgReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [rbacStateKey]: rbacReducer,
  [reportStateKey]: reportReducer,
  [resourceStateKey]: resourceReducer,
  [rhelCostOverviewStateKey]: rhelCostOverviewReducer,
  [rhelDashboardStateKey]: rhelDashboardReducer,
  [rhelHistoricalDataStateKey]: rhelHistoricalDataReducer,
  [settingsStateKey]: settingsReducer,
  [sourcesStateKey]: sourcesReducer,
  [tagStateKey]: tagReducer,
  [uiStateKey]: uiReducer,
  [userAccessStateKey]: userAccessReducer,
  notifications: notificationsReducer,
});
