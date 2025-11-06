import type { AccountSettingsType } from 'api/accountSettings';

export const stateKey = 'accountSettings';

export function getFetchId(settingsType: AccountSettingsType) {
  return `${settingsType}`;
}
