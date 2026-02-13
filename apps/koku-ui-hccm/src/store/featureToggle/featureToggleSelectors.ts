import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectIsAwsEc2InstancesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAwsEc2InstancesToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsExactFilterToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExactFilterToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsGpuToggleEnabled = (state: RootState) => selectFeatureToggleState(state)?.isGpuToggleEnabled;
export const selectIsNamespaceToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isNamespaceToggleEnabled;
export const selectIsSystemsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isSystemsToggleEnabled;
