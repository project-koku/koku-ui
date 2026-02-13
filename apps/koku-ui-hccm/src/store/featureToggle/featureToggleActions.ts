import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isAwsEc2InstancesToggleEnabled?: boolean;
  isDebugToggleEnabled?: boolean;
  isExactFilterToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  isGpuToggleEnabled?: boolean;
  isNamespaceToggleEnabled?: boolean;
  isSystemsToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
