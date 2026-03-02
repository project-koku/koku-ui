import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureToggleReducer';

export const selectFeatureToggleState = (state: RootState) => state[stateKey];

export const selectHasFeatureToggle = (state: RootState) => selectFeatureToggleState(state).hasFeatureToggle;

export const selectIsBoxPlotToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isBoxPlotToggleEnabled;
export const selectIsDebugToggleEnabled = (state: RootState) => selectFeatureToggleState(state).isDebugToggleEnabled;
export const selectIsProjectLinkToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isProjectLinkToggleEnabled;
export const selectIsNamespaceToggleEnabled = (state: RootState) =>
  selectFeatureToggleState(state).isNamespaceToggleEnabled;
