import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureFlagsActions';
import { setFeatureFlags } from './featureFlagsActions';

export type FeatureFlagsAction = ActionType<typeof setFeatureFlags | typeof resetState>;

export type FeatureFlagsState = Readonly<{
  hasFeatureFlags: boolean;
  isExportsFeatureEnabled: boolean;
  isFinsightsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isRosFeatureEnabled: boolean;
  isSettingsPlatformFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isExportsFeatureEnabled: false,
  isFinsightsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isRosFeatureEnabled: false,
  isSettingsPlatformFeatureEnabled: false,
};

export const stateKey = 'featureFlags';

export function featureFlagsReducer(state = defaultState, action: FeatureFlagsAction): FeatureFlagsState {
  switch (action.type) {
    case getType(setFeatureFlags):
      return {
        ...state,
        hasFeatureFlags: true,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isFinsightsFeatureEnabled: action.payload.isFinsightsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isRosFeatureEnabled: action.payload.isRosFeatureEnabled,
        isSettingsPlatformFeatureEnabled: action.payload.isSettingsPlatformFeatureEnabled,
      };

    default:
      return state;
  }
}
