import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureFlagsReducer';

export const selectFeatureFlagsState = (state: RootState) => state[stateKey];

export const selectHasFeatureFlags = (state: RootState) => selectFeatureFlagsState(state).hasFeatureFlags;

export const selectIsCurrencyFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state)?.isCurrencyFeatureEnabled;
export const selectIsCostDistributionFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state)?.isCostDistributionFeatureEnabled;
export const selectIsCostTypeFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isCostTypeFeatureEnabled;
export const selectIsExportsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isExportsFeatureEnabled;
export const selectIsIbmFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isIbmFeatureEnabled;
export const selectIsNegativeFilteringFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isNegativeFilteringFeatureEnabled;
export const selectIsOciFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isOciFeatureEnabled;
export const selectIsPlatformCostsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isPlatformCostsFeatureEnabled;
export const selectIsUnallocatedCostsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isUnallocatedCostsFeatureEnabled;
