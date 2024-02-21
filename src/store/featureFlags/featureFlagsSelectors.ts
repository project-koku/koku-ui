import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureFlagsReducer';

export const selectFeatureFlagsState = (state: RootState) => state[stateKey];

export const selectHasFeatureFlags = (state: RootState) => selectFeatureFlagsState(state).hasFeatureFlags;

export const selectIsClusterInfoFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isClusterInfoFeatureEnabled;
export const selectIsExportsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isExportsFeatureEnabled;
export const selectIsFinsightsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isFinsightsFeatureEnabled;
export const selectIsIbmFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isIbmFeatureEnabled;
export const selectIsRosFeatureEnabled = (state: RootState) => selectFeatureFlagsState(state).isRosFeatureEnabled;
export const selectIsSettingsPlatformFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isSettingsPlatformFeatureEnabled;
export const selectIsTagMappingFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isTagMappingFeatureEnabled;
