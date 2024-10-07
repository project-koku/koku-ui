import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectHasFeatureToggle = (state: RootState) => selectFeatureToggleState(state).hasFeatureToggle;

export const selectIsAccountInfoDetailsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAccountInfoDetailsToggleEnabled;
export const selectIsAccountInfoEmptyStateToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAccountInfoEmptyStateToggleEnabled;
export const selectIsAwsEc2InstancesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAwsEc2InstancesToggleEnabled;
export const selectIsChartSkeletonToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isChartSkeletonToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsDetailsDateRangeToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isDetailsDateRangeToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsFinsightsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isFinsightsToggleEnabled;
export const selectIsIbmToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isIbmToggleEnabled;
export const selectIsOcpCloudGroupBysToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isOcpCloudGroupBysToggleEnabled;
