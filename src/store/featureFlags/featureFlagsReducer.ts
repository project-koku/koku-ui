import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { resetState, setFeatureFlags } from './featureFlagsActions';

export type FeatureFlagsAction = ActionType<typeof setFeatureFlags | typeof resetState>;

export type FeatureFlagsState = Readonly<{
  hasFeatureFlags: boolean;
  isCurrencyFeatureEnabled: boolean;
  isExcludesFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isOciFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isCurrencyFeatureEnabled: false,
  isExcludesFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isOciFeatureEnabled: false,
};

export const stateKey = 'featureFlags';

export function featureFlagsReducer(state = defaultState, action: FeatureFlagsAction): FeatureFlagsState {
  switch (action.type) {
    case getType(setFeatureFlags):
      return {
        ...state,
        hasFeatureFlags: true,
        isCurrencyFeatureEnabled: action.payload.isCurrencyFeatureEnabled,
        isExcludesFeatureEnabled: action.payload.isExcludesFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isOciFeatureEnabled: action.payload.isOciFeatureEnabled,
      };

    default:
      return state;
  }
}
