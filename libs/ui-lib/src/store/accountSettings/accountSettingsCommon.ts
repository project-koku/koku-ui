import type { AccountSettingsType } from '@koku-ui/api/accountSettings';

export const accountSettingsStateKey = 'accountSettings';

export function getFetchId(settingsType: AccountSettingsType) {
  return `${settingsType}`;
}
