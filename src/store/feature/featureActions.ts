import { createAction } from 'typesafe-actions';

interface FeatureActionMeta {
  isCurrencyFeatureEnabled?: boolean;
  isExportsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
}

export const initFeatures = createAction('feature/init_feature_toggles')<FeatureActionMeta>();
export const resetState = createAction('feature/reset_state')();
