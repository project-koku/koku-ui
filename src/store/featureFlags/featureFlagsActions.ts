import { createAction } from 'typesafe-actions';

export interface FeatureFlagsActionMeta {
  isCostDistributionFeatureEnabled?: boolean;
  isCostTypeFeatureEnabled?: boolean;
  isCurrencyFeatureEnabled?: boolean;
  isDefaultProjectsFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isNegativeFilteringFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
  isUnallocatedCostsFeatureEnabled?: boolean;
}

export const setFeatureFlags = createAction('feature/init_feature_flags')<FeatureFlagsActionMeta>();
export const resetState = createAction('feature/reset_state')();
