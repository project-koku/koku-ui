import { RootState } from 'store/rootReducer';

import { stateKey } from './featureFlagsReducer';

export const selectFeatureFlagsState = (state: RootState) => state[stateKey];

export const selectHasFeatureFlags = (state: RootState) => selectFeatureFlagsState(state).hasFeatureFlags;

export const selectIsCurrencyFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state)?.isCurrencyFeatureEnabled;
export const selectIsExcludesFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isExcludesFeatureEnabled;
export const selectIsExportsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isExportsFeatureEnabled;
export const selectIsIbmFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isIbmFeatureEnabled;
export const selectIsOciFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isOciFeatureEnabled;
