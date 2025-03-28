import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  isCostBreakdownChartToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isFinsightsToggleEnabled: boolean;
  isIbmToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  isCostBreakdownChartToggleEnabled: false,
  isDebugToggleEnabled: false,
  isExportsToggleEnabled: false,
  isFinsightsToggleEnabled: false,
  isIbmToggleEnabled: false,
};

export const stateKey = 'FeatureToggle';

export function FeatureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        isCostBreakdownChartToggleEnabled: action.payload.isCostBreakdownChartToggleEnabled,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isFinsightsToggleEnabled: action.payload.isFinsightsToggleEnabled,
        isIbmToggleEnabled: action.payload.isIbmToggleEnabled,
      };

    default:
      return state;
  }
}
