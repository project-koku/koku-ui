import { ActionType, getType } from 'typesafe-actions';

import { initFeatures, resetState } from './featureActions';

export type FeatureAction = ActionType<typeof initFeatures | typeof resetState>;

export type FeatureState = Readonly<{
  isCurrencyFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isOciFeatureEnabled: boolean;
}>;

export const defaultState: FeatureState = {
  isCurrencyFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isOciFeatureEnabled: false,
};

export const stateKey = 'feature';

export function featureReducer(state = defaultState, action: FeatureAction): FeatureState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(initFeatures):
      return {
        ...state,
        isCurrencyFeatureEnabled: action.payload.isCurrencyFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isOciFeatureEnabled: action.payload.isOciFeatureEnabled,
      };

    default:
      return state;
  }
}
