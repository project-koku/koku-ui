import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  isAwsEc2InstancesToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isDisplayToggleEnabled: boolean;
  isEfficiencyToggleEnabled: boolean;
  isExactFilterToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isGpuToggleEnabled: boolean;
  isMigToggleEnabled: boolean;
  isNamespaceToggleEnabled: boolean;
  isOrgAdmin: boolean;
  isPriceListToggleEnabled: boolean;
  isPriceListRatesToggleEnabled: boolean;
  isSystemsToggleEnabled: boolean;
  isWastedCostToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  isAwsEc2InstancesToggleEnabled: false,
  isDebugToggleEnabled: false,
  isDisplayToggleEnabled: false,
  isEfficiencyToggleEnabled: false,
  isExactFilterToggleEnabled: false,
  isExportsToggleEnabled: false,
  isGpuToggleEnabled: false,
  isMigToggleEnabled: false,
  isNamespaceToggleEnabled: false,
  isOrgAdmin: false,
  isPriceListToggleEnabled: false,
  isPriceListRatesToggleEnabled: false,
  isSystemsToggleEnabled: false,
  isWastedCostToggleEnabled: false,
};

export const stateKey = 'FeatureToggle';

export function FeatureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        isAwsEc2InstancesToggleEnabled: action.payload.isAwsEc2InstancesToggleEnabled,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isDisplayToggleEnabled: action.payload.isDisplayToggleEnabled,
        isEfficiencyToggleEnabled: action.payload.isEfficiencyToggleEnabled,
        isExactFilterToggleEnabled: action.payload.isExactFilterToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isGpuToggleEnabled: action.payload.isGpuToggleEnabled,
        isMigToggleEnabled: action.payload.isMigToggleEnabled,
        isNamespaceToggleEnabled: action.payload.isNamespaceToggleEnabled,
        isOrgAdmin: action.payload.isOrgAdmin,
        isPriceListToggleEnabled: action.payload.isPriceListToggleEnabled,
        isPriceListRatesToggleEnabled: action.payload.isPriceListRatesToggleEnabled,
        isSystemsToggleEnabled: action.payload.isSystemsToggleEnabled,
        isWastedCostToggleEnabled: action.payload.isWastedCostToggleEnabled,
      };

    default:
      return state;
  }
}
