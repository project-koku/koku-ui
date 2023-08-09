import type { SettingsType } from 'api/settings';
import type { RootState } from 'store/rootReducer';

import { getFetchId } from './settingsCommon';
import { settingsStateKey } from './settingsCommon';

export const selectSettingsState = (state: RootState) => state[settingsStateKey];

export const selectSettings = (state: RootState, settingsType: SettingsType, reportQueryString: string) =>
  selectSettingsState(state).byId.get(getFetchId(settingsType, reportQueryString));

export const selectSettingsStatus = (state: RootState, settingsType: SettingsType, reportQueryString: string) =>
  selectSettingsState(state)?.status.get(getFetchId(settingsType, reportQueryString));

export const selectSettingsError = (state: RootState, settingsType: SettingsType, reportQueryString: string) =>
  selectSettingsState(state)?.errors.get(getFetchId(settingsType, reportQueryString));

export const selectSettingsUpdateStatus = (state: RootState, settingsType: SettingsType, reportQueryString: string) =>
  selectSettingsState(state)?.status.get(getFetchId(settingsType, reportQueryString));

export const selectSettingsUpdateError = (state: RootState, settingsType: SettingsType, reportQueryString: string) =>
  selectSettingsState(state)?.errors.get(getFetchId(settingsType, reportQueryString));
