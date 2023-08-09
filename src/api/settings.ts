import axios from 'axios';

import type { PagedLinks, PagedMetaData } from './api';

export interface SettingsData {
  uuid: string;
  key: string;
  enabled: boolean;
}

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
}

export interface Settings {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: SettingsData;
}

export interface SettingsPayload {
  ids: string[];
}

// eslint-disable-next-line no-shadow
export const enum SettingsType {
  awsCategoryKeys = 'awsCategoryKeys',
  awsCategoryKeysEnable = 'awsCategoryKeysEnable',
  awsCategoryKeysDisable = 'awsCategoryKeysDisable',
}

export const SettingsTypePaths: Partial<Record<SettingsType, string>> = {
  [SettingsType.awsCategoryKeys]: 'settings/aws_category_keys/',
  [SettingsType.awsCategoryKeysEnable]: 'settings/aws_category_keys/enable/',
  [SettingsType.awsCategoryKeysDisable]: 'settings/aws_category_keys/disable/',
};

export function fetchSettings(settingsType: SettingsType, query: string) {
  const path = SettingsTypePaths[settingsType];
  return axios.get<Settings>(`${path}?${query}`);
}

export function updateSettings(settingsType: SettingsType, payload: SettingsPayload) {
  const path = SettingsTypePaths[settingsType];
  return axios.put(`${path}`, payload);
}
