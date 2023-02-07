import { createAction } from 'typesafe-actions';

export interface FeatureFlagsActionMeta {
  isCostDistributionFeatureEnabled?: boolean;
  isCostTypeFeatureEnabled?: boolean;
  isCurrencyFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  isFinsightsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isNegativeFilteringFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
  isPlatformCostsFeatureEnabled?: boolean;
  isRosFeatureEnabled?: boolean;
}

export const setFeatureFlags = createAction('feature/init_feature_flags')<FeatureFlagsActionMeta>();
export const resetState = createAction('feature/reset_state')();
