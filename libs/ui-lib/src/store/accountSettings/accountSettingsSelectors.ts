import type { AccountSettingsType } from '@koku-ui/api/accountSettings';

import type { RootState } from '../rootReducer';
import { accountSettingsStateKey, getFetchId } from './accountSettingsCommon';

export const selectAccountSettingsState = (state: RootState) => state[accountSettingsStateKey];

export const selectAccountSettings = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state).byId.get(getFetchId(accountSettingsType));

export const selectAccountSettingsError = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state)?.errors.get(getFetchId(accountSettingsType));

export const selectAccountSettingsStatus = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state)?.status.get(getFetchId(accountSettingsType));

export const selectAccountSettingsUpdateError = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state)?.errors.get(getFetchId(accountSettingsType));

export const selectAccountSettingsUpdateNotification = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state)?.notification?.get(getFetchId(accountSettingsType));

export const selectAccountSettingsUpdateStatus = (state: RootState, accountSettingsType: AccountSettingsType) =>
  selectAccountSettingsState(state)?.status.get(getFetchId(accountSettingsType));
