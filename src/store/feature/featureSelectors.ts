import { RootState } from 'store/rootReducer';

import { stateKey } from './featureReducer';

export const selectFeatureState = (state: RootState) => state[stateKey];

export const selectIsCurrencyFeatureEnabled = (state: RootState) => selectFeatureState(state).isCurrencyFeatureEnabled;
export const selectIsExportsFeatureEnabled = (state: RootState) => selectFeatureState(state).isExportsFeatureEnabled;
export const selectIsIbmFeatureEnabled = (state: RootState) => selectFeatureState(state).isIbmFeatureEnabled;
export const selectIsOciFeatureEnabled = (state: RootState) => selectFeatureState(state).isOciFeatureEnabled;
