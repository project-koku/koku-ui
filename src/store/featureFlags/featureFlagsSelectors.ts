import { RootState } from 'store/rootReducer';

import { stateKey } from './featureFlagsReducer';

export const selectFeatureFlagsState = (state: RootState) => state[stateKey];

export const selectIsCurrencyFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isCurrencyFeatureEnabled;
export const selectIsExportsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isExportsFeatureEnabled;
export const selectIsIbmFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isIbmFeatureEnabled;
export const selectIsOciFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isOciFeatureEnabled;
