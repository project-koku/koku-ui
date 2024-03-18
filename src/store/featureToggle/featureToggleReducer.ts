import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  hasFeatureToggle: boolean;
  isClusterInfoToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isFinsightsToggleEnabled: boolean;
  isIbmToggleEnabled: boolean;
  isRosToggleEnabled: boolean;
  isSettingsPlatformToggleEnabled: boolean;
  isTagMappingToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  hasFeatureToggle: false,
  isClusterInfoToggleEnabled: false,
  isDebugToggleEnabled: false,
  isExportsToggleEnabled: false,
  isFinsightsToggleEnabled: false,
  isIbmToggleEnabled: false,
  isRosToggleEnabled: false,
  isSettingsPlatformToggleEnabled: false,
  isTagMappingToggleEnabled: false,
};

export const stateKey = 'FeatureToggle';

export function FeatureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        hasFeatureToggle: true,
        isClusterInfoToggleEnabled: action.payload.isClusterInfoToggleEnabled,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isFinsightsToggleEnabled: action.payload.isFinsightsToggleEnabled,
        isIbmToggleEnabled: action.payload.isIbmToggleEnabled,
        isRosToggleEnabled: action.payload.isRosToggleEnabled,
        isSettingsPlatformToggleEnabled: action.payload.isSettingsPlatformToggleEnabled,
        isTagMappingToggleEnabled: action.payload.isTagMappingToggleEnabled,
      };

    default:
      return state;
  }
}
