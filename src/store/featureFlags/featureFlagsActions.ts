import { createAction } from 'typesafe-actions';

export interface FeatureFlagsActionMeta {
  isCurrencyFeatureEnabled?: boolean;
  isDistributionFeatureEnabled?: boolean;
  isExcludesFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
}

export const setFeatureFlags = createAction('feature/init_feature_flags')<FeatureFlagsActionMeta>();
export const resetState = createAction('feature/reset_state')();
