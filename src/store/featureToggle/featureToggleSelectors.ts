import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectHasFeatureToggle = (state: RootState) => selectFeatureToggleState(state).hasFeatureToggle;

export const selectIsClusterInfoToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isClusterInfoToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsFinsightsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isFinsightsToggleEnabled;
export const selectIsIbmToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isIbmToggleEnabled;
export const selectIsRosToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isRosToggleEnabled;
export const selectIsSettingsPlatformToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isSettingsPlatformToggleEnabled;
export const selectIsTagMappingToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isTagMappingToggleEnabled;
