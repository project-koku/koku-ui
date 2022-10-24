import * as ocpDashboardActions from './ocpDashboardActions';
import type { OcpDashboardWidget } from './ocpDashboardCommon';
import { ocpDashboardStateKey, OcpDashboardTab } from './ocpDashboardCommon';
import { ocpDashboardReducer } from './ocpDashboardReducer';
import * as ocpDashboardSelectors from './ocpDashboardSelectors';

export {
  ocpDashboardStateKey,
  ocpDashboardReducer,
  ocpDashboardActions,
  ocpDashboardSelectors,
  OcpDashboardTab,
  OcpDashboardWidget,
};
