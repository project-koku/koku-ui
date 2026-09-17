import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

// Flag indicating user has org admin permissions
export const selectIsOrgAdmin = (state: RootState) => selectFeatureToggleState(state).isOrgAdmin;

// Feature toggles

export const selectIsAwsEc2InstancesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isAwsEc2InstancesToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsExchangeRateToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExchangeRateToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsNamespaceToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isNamespaceToggleEnabled;
export const selectIsPriceListRatesToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isPriceListRatesToggleEnabled;
export const selectIsSystemsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isSystemsToggleEnabled;
