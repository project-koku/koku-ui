import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectHasFeatureToggle = (state: RootState) => selectFeatureToggleState(state).hasFeatureToggle;

export const selectIsAwsEc2InstancesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAwsEc2InstancesToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsFinsightsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isFinsightsToggleEnabled;
export const selectIsIbmToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isIbmToggleEnabled;
export const selectIsOcpCloudNetworkingToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isOcpCloudNetworkingToggleEnabled;
export const selectIsOcpProjectStorageToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isOcpProjectStorageToggleEnabled;
export const selectIsRosToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isRosToggleEnabled;
