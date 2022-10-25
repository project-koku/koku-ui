import * as azureOcpDashboardActions from './azureOcpDashboardActions';
import type { AzureOcpDashboardWidget } from './azureOcpDashboardCommon';
import { azureOcpDashboardStateKey, AzureOcpDashboardTab } from './azureOcpDashboardCommon';
import { azureOcpDashboardReducer } from './azureOcpDashboardReducer';
import * as azureOcpDashboardSelectors from './azureOcpDashboardSelectors';

export type { AzureOcpDashboardWidget };
export {
  azureOcpDashboardStateKey,
  azureOcpDashboardReducer,
  azureOcpDashboardActions,
  azureOcpDashboardSelectors,
  AzureOcpDashboardTab,
};
