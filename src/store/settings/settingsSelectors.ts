import type { RootState } from 'store/rootReducer';

import { stateKey } from './settingsCommon';

export const selectSettingsState = (state: RootState) => state[stateKey];

// Update settings

export const selectSettingsUpdateStatus = (state: RootState) => selectSettingsState(state).status;

export const selectSettingsError = (state: RootState) => selectSettingsState(state).error;
