import type { RootState } from 'store/rootReducer';

import { getReportId, stateKey } from './accountSettingsCommon';

export const selectAccountSettingsState = (state: RootState) => state[stateKey];

// Fetch account settings

export const selectAccountSettings = (state: RootState) => selectAccountSettingsState(state).byId.get(getReportId());

export const selectAccountSettingsFetchStatus = (state: RootState) =>
  selectAccountSettingsState(state).fetchStatus.get(getReportId());

export const selectAccountSettingsError = (state: RootState) =>
  selectAccountSettingsState(state).errors.get(getReportId());
