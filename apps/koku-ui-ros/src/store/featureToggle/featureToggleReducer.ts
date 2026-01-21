import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  hasFeatureToggle: boolean;
  isDebugToggleEnabled: boolean;
  isBoxPlotToggleEnabled: boolean;
  isNamespaceToggleEnabled: boolean;
  isProjectLinkToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  hasFeatureToggle: false,
  isDebugToggleEnabled: false,
  isBoxPlotToggleEnabled: false,
  isNamespaceToggleEnabled: false,
  isProjectLinkToggleEnabled: false,
};

export const stateKey = 'featureToggle';

export function featureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        hasFeatureToggle: true,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isBoxPlotToggleEnabled: action.payload.isBoxPlotToggleEnabled,
        isNamespaceToggleEnabled: action.payload.isNamespaceToggleEnabled,
        isProjectLinkToggleEnabled: action.payload.isProjectLinkToggleEnabled,
      };

    default:
      return state;
  }
}
