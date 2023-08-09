import type { SettingsType } from 'api/settings';

export const settingsStateKey = 'settings';

export function getFetchId(settingsType: SettingsType, settingsQueryString: string) {
  return `${settingsType}--${settingsQueryString}`;
}
