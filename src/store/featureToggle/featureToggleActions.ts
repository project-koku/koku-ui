import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isDebugToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  isSystemsToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
