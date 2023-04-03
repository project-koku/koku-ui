import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureFlagsActions';
import { setFeatureFlags } from './featureFlagsActions';

export type FeatureFlagsAction = ActionType<typeof setFeatureFlags | typeof resetState>;

export type FeatureFlagsState = Readonly<{
  hasFeatureFlags: boolean;
  isCostDistributionFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isFinsightsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isRosFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isCostDistributionFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isFinsightsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isRosFeatureEnabled: false,
};

export const stateKey = 'featureFlags';

export function featureFlagsReducer(state = defaultState, action: FeatureFlagsAction): FeatureFlagsState {
  switch (action.type) {
    case getType(setFeatureFlags):
      return {
        ...state,
        hasFeatureFlags: true,
        isCostDistributionFeatureEnabled: action.payload.isCostDistributionFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isFinsightsFeatureEnabled: action.payload.isFinsightsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isRosFeatureEnabled: action.payload.isRosFeatureEnabled,
      };

    default:
      return state;
  }
}
