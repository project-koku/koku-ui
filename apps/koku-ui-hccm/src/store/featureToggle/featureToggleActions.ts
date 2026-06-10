import { createAction } from 'typesafe-actions';

export interface FeatureToggleActionMeta {
  isAwsEc2InstancesToggleEnabled?: boolean;
  isDebugToggleEnabled?: boolean;
  isEfficiencyToggleEnabled?: boolean;
  isExactFilterToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
  isGpuToggleEnabled?: boolean;
  isMigToggleEnabled?: boolean;
  isNamespaceToggleEnabled?: boolean;
  isPriceListToggleEnabled?: boolean;
  isSystemsToggleEnabled?: boolean;
  isWastedCostToggleEnabled?: boolean;
}

export const setFeatureToggle = createAction('feature/init_feature_toggle')<FeatureToggleActionMeta>();
export const resetState = createAction('feature/reset_state')();
