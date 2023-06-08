import { createAction } from 'typesafe-actions';

export interface FeatureFlagsActionMeta {
  isCostCategoriesFeatureEnabled?: boolean;
  isCostDistributionFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  isFinsightsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isRosFeatureEnabled?: boolean;
  isSettingsFeatureEnabled?: boolean;
  isSettingsPlatformFeatureEnabled?: boolean;
}

export const setFeatureFlags = createAction('feature/init_feature_flags')<FeatureFlagsActionMeta>();
export const resetState = createAction('feature/reset_state')();
