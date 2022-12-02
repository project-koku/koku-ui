import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureFlagsActions';
import { setFeatureFlags } from './featureFlagsActions';

export type FeatureFlagsAction = ActionType<typeof setFeatureFlags | typeof resetState>;

export type FeatureFlagsState = Readonly<{
  hasFeatureFlags: boolean;
  isCostDistributionFeatureEnabled: boolean;
  isCostTypeFeatureEnabled: boolean;
  isCurrencyFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isFINsightsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isNegativeFilteringFeatureEnabled: boolean;
  isOciFeatureEnabled: boolean;
  isPlatformCostsFeatureEnabled: boolean;
  isUnallocatedCostsFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isCostDistributionFeatureEnabled: false,
  isCostTypeFeatureEnabled: false,
  isCurrencyFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isFINsightsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isNegativeFilteringFeatureEnabled: false,
  isOciFeatureEnabled: false,
  isPlatformCostsFeatureEnabled: false,
  isUnallocatedCostsFeatureEnabled: false,
};

export const stateKey = 'featureFlags';

export function featureFlagsReducer(state = defaultState, action: FeatureFlagsAction): FeatureFlagsState {
  switch (action.type) {
    case getType(setFeatureFlags):
      return {
        ...state,
        hasFeatureFlags: true,
        isCostDistributionFeatureEnabled: action.payload.isCostDistributionFeatureEnabled,
        isCostTypeFeatureEnabled: action.payload.isCostTypeFeatureEnabled,
        isCurrencyFeatureEnabled: action.payload.isCurrencyFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isFINsightsFeatureEnabled: action.payload.isFINsightsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isNegativeFilteringFeatureEnabled: action.payload.isNegativeFilteringFeatureEnabled,
        isOciFeatureEnabled: action.payload.isOciFeatureEnabled,
        isPlatformCostsFeatureEnabled: action.payload.isPlatformCostsFeatureEnabled,
        isUnallocatedCostsFeatureEnabled: action.payload.isUnallocatedCostsFeatureEnabled,
      };

    default:
      return state;
  }
}
