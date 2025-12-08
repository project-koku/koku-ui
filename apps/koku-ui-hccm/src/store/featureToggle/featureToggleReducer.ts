import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  isAwsEc2InstancesToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isExactFilterToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isGpuToggleEnabled: boolean;
  isSystemsToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  isAwsEc2InstancesToggleEnabled: false,
  isDebugToggleEnabled: false,
  isExactFilterToggleEnabled: false,
  isExportsToggleEnabled: false,
  isGpuToggleEnabled: false,
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
        isExactFilterToggleEnabled: action.payload.isExactFilterToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isGpuToggleEnabled: action.payload.isGpuToggleEnabled,
        isSystemsToggleEnabled: action.payload.isSystemsToggleEnabled,
      };

    default:
      return state;
  }
}
