import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isCostBreakdownChartToggleEnabled?: boolean;
  isDebugToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  isFinsightsToggleEnabled?: boolean;
  isIbmToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
