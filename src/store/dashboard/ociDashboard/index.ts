import * as ociDashboardActions from './ociDashboardActions';
import type { OciDashboardWidget } from './ociDashboardCommon';
import { ociDashboardStateKey, OciDashboardTab } from './ociDashboardCommon';
import { ociDashboardReducer } from './ociDashboardReducer';
import * as ociDashboardSelectors from './ociDashboardSelectors';
import * as ociDashboardWidgets from './ociDashboardWidgets';

export type { OciDashboardWidget };
export {
  ociDashboardStateKey,
  ociDashboardReducer,
  ociDashboardActions,
  ociDashboardSelectors,
  ociDashboardWidgets,
  OciDashboardTab,
};
