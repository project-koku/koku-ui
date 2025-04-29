import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsExportsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isExportsToggleEnabled;
export const selectIsFinsightsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isFinsightsToggleEnabled;
export const selectIsIbmToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isIbmToggleEnabled;
export const selectIsSystemsToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isSystemsToggleEnabled;
