import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isDebugToggleEnabled?: boolean;
  isBoxPlotToggleEnabled?: boolean;
  isNamespaceToggleEnabled?: boolean;
  isProjectLinkToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
