import * as awsDashboardActions from './awsDashboardActions';
import type { AwsDashboardWidget } from './awsDashboardCommon';
import { awsDashboardStateKey, AwsDashboardTab } from './awsDashboardCommon';
import { awsDashboardReducer } from './awsDashboardReducer';
import * as awsDashboardSelectors from './awsDashboardSelectors';
import * as awsDashboardWidgets from './awsDashboardWidgets';

export type { AwsDashboardWidget };
export {
  awsDashboardStateKey,
  awsDashboardReducer,
  awsDashboardActions,
  awsDashboardSelectors,
  awsDashboardWidgets,
  AwsDashboardTab,
};
