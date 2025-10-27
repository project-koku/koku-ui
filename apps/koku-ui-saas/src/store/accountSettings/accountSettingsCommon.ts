import type { AccountSettingsType } from 'api/accountSettings';

export const accountSettingsStateKey = 'accountSettings';

export function getFetchId(settingsType: AccountSettingsType) {
  return `${settingsType}`;
}
