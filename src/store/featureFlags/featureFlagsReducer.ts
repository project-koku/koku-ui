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
  isDefaultProjectsFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isNegativeFilteringFeatureEnabled: boolean;
  isOciFeatureEnabled: boolean;
  isUnallocatedCostsFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isCostDistributionFeatureEnabled: false,
  isCostTypeFeatureEnabled: false,
  isCurrencyFeatureEnabled: false,
  isDefaultProjectsFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isNegativeFilteringFeatureEnabled: false,
  isOciFeatureEnabled: false,
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
        isDefaultProjectsFeatureEnabled: action.payload.isDefaultProjectsFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isNegativeFilteringFeatureEnabled: action.payload.isNegativeFilteringFeatureEnabled,
        isOciFeatureEnabled: action.payload.isOciFeatureEnabled,
        isUnallocatedCostsFeatureEnabled: action.payload.isUnallocatedCostsFeatureEnabled,
      };

    default:
      return state;
  }
}
