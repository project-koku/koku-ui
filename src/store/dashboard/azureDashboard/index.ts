import * as azureDashboardActions from './azureDashboardActions';
import type { AzureDashboardWidget } from './azureDashboardCommon';
import { azureDashboardStateKey, AzureDashboardTab } from './azureDashboardCommon';
import { azureDashboardReducer } from './azureDashboardReducer';
import * as azureDashboardSelectors from './azureDashboardSelectors';
import * as azureDashboardWidgets from './azureDashboardWidgets';

export type { AzureDashboardWidget };
export {
  azureDashboardStateKey,
  azureDashboardReducer,
  azureDashboardActions,
  azureDashboardSelectors,
  azureDashboardWidgets,
  AzureDashboardTab,
};
