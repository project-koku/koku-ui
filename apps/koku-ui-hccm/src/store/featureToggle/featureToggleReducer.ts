import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  isAwsEc2InstancesToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isExchangeRateToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isNamespaceToggleEnabled: boolean;
  isOrgAdmin: boolean;
  isPriceListRatesToggleEnabled: boolean;
  isSystemsToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  isAwsEc2InstancesToggleEnabled: false,
  isDebugToggleEnabled: false,
  isExchangeRateToggleEnabled: false,
  isExportsToggleEnabled: false,
  isNamespaceToggleEnabled: false,
  isOrgAdmin: false,
  isPriceListRatesToggleEnabled: false,
  isSystemsToggleEnabled: false,
};

export const stateKey = 'FeatureToggle';

export function FeatureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        isAwsEc2InstancesToggleEnabled: action.payload.isAwsEc2InstancesToggleEnabled,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isExchangeRateToggleEnabled: action.payload.isExchangeRateToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isNamespaceToggleEnabled: action.payload.isNamespaceToggleEnabled,
        isOrgAdmin: action.payload.isOrgAdmin,
        isPriceListRatesToggleEnabled: action.payload.isPriceListRatesToggleEnabled,
        isSystemsToggleEnabled: action.payload.isSystemsToggleEnabled,
      };

    default:
      return state;
  }
}
