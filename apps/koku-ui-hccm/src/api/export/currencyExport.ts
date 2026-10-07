import { axiosInstance } from 'api';
import type { SettingsType } from 'api/settings';
import { SettingsTypePaths } from 'api/settings';

export function runExport(settingsType: SettingsType, query: string) {
  const path = SettingsTypePaths[settingsType];
  return axiosInstance.get<string>(`${path}?${query}`, {
    headers: {
      Accept: 'text/csv',
    },
  });
}
