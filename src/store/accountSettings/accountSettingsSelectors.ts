import type { RootState } from 'store/rootReducer';
import { selectSettingsState } from 'store/settings/settingsSelectors';

import { getFetchId, stateKey } from './accountSettingsCommon';

export const selectAccountSettingsState = (state: RootState) => state[stateKey];

// Fetch account settings

export const selectAccountSettings = (state: RootState) => selectAccountSettingsState(state).byId.get(getFetchId());

export const selectAccountSettingsFetchStatus = (state: RootState) =>
  selectAccountSettingsState(state).fetchStatus.get(getFetchId());

export const selectAccountSettingsError = (state: RootState) =>
  selectAccountSettingsState(state).errors.get(getFetchId());

export const selectUpdateCostTypeError = (state: RootState) => selectSettingsState(state).error;

export const selectUpdateCostTypeStatus = (state: RootState) => selectSettingsState(state).status;

export const selectUpdateCurrencyError = (state: RootState) => selectSettingsState(state).error;

export const selectUpdateCurrencyStatus = (state: RootState) => selectSettingsState(state).status;
