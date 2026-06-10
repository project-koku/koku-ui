import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectIsAwsEc2InstancesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAwsEc2InstancesToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsEfficiencyToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isEfficiencyToggleEnabled;
export const selectIsExactFilterToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExactFilterToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsGpuToggleEnabled = (state: RootState) => selectFeatureToggleState(state)?.isGpuToggleEnabled;
export const selectIsMigToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isMigToggleEnabled;
export const selectIsNamespaceToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isNamespaceToggleEnabled;
export const selectIsPriceListToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isPriceListToggleEnabled;
export const selectIsSystemsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isSystemsToggleEnabled;
export const selectIsWastedCostToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isWastedCostToggleEnabled;
