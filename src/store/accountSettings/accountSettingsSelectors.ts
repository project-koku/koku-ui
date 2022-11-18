import type { RootState } from 'store/rootReducer';

import { getFetchId, stateKey } from './accountSettingsCommon';

export const selectAccountSettingsState = (state: RootState) => state[stateKey];

// Fetch account settings

export const selectAccountSettings = (state: RootState) => selectAccountSettingsState(state).byId.get(getFetchId());

export const selectAccountSettingsFetchStatus = (state: RootState) =>
  selectAccountSettingsState(state).fetchStatus.get(getFetchId());

export const selectAccountSettingsError = (state: RootState) =>
  selectAccountSettingsState(state).errors.get(getFetchId());
