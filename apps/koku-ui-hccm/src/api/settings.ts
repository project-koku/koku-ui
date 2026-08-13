import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
  enabled_tags_count?: number;
  enabled_tags_limit?: number;
}

export interface SettingsRatePayload {
  base_currency?: string;
  end_date?: string;
  exchange_rate?: number;
  start_date?: string;
  target_currency?: string;
}

export interface SettingsRateData extends SettingsRatePayload {
  name?: string;
  created_timestamp?: string;
  updated_timestamp?: string;
  uuid?: string;
}

export interface SettingsCurrencyData {
  code?: string;
  name?: string;
  symbol?: string;
  description?: string;
  enabled?: boolean;
  has_dynamic_rate?: boolean;
  is_disableable?: boolean;
  static_rates?: SettingsRateData[];
}

export interface SettingsData extends SettingsCurrencyData {
  clusters?: string[];
  default?: boolean;
  project?: string;
  group?: string;
  uuid?: string;
  key?: string;
  enabled?: boolean;
  source_type?: string;
}

export interface Settings {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: SettingsData[];
}

export interface SettingsCategoryPayload {
  ids?: string[];
}

export interface SettingsPlatformPayload {
  project?: string;
  group?: string;
}

export interface SettingsTagPayload {
  children?: string[];
  ids?: string[];
  parent?: string;
}

export const enum SettingsType {
  costCategories = 'costCategories',
  costCategoriesEnable = 'costCategoriesEnable',
  costCategoriesDisable = 'costCategoriesDisable',
  currency = 'currency',
  currencyAdd = 'currencyAdd',
  currencyDelete = 'currencyDelete',
  currencyDisable = 'currencyDisable',
  currencyEdit = 'currencyEdit',
  currencyEnable = 'currencyEnable',
  platformProjects = 'platformProjects',
  platformProjectsAdd = 'platformProjectsAdd',
  platformProjectsRemove = 'platformProjectsRemove',
  tags = 'tags',
  tagsEnable = 'tagsEnable',
  tagsDisable = 'tagsDisable',
  tagsMappings = 'tagsMappings',
  tagsMappingsChild = 'tagsMappingsChild',
  tagsMappingsChildAdd = 'tagsMappingsChildAdd',
  tagsMappingsChildRemove = 'tagsMappingsChildRemove',
  tagsMappingsParent = 'tagsMappingsParent',
  tagsMappingsParentRemove = 'tagsMappingsParentRemove',
}

export const SettingsTypePaths: Partial<Record<SettingsType, string>> = {
  [SettingsType.costCategories]: 'settings/aws_category_keys/',
  [SettingsType.costCategoriesEnable]: 'settings/aws_category_keys/enable/',
  [SettingsType.costCategoriesDisable]: 'settings/aws_category_keys/disable/',
  [SettingsType.currency]: 'settings/currency/',
  [SettingsType.currencyAdd]: 'settings/currency/static-rates/',
  [SettingsType.currencyDelete]: 'settings/currency/static-rates/',
  [SettingsType.currencyDisable]: 'settings/currency/enabled/',
  [SettingsType.currencyEdit]: 'settings/currency/static-rates/',
  [SettingsType.currencyEnable]: 'settings/currency/enabled/',
  [SettingsType.platformProjects]: 'settings/cost-groups/',
  [SettingsType.platformProjectsAdd]: 'settings/cost-groups/add/',
  [SettingsType.platformProjectsRemove]: 'settings/cost-groups/remove/',
  [SettingsType.tags]: 'settings/tags/',
  [SettingsType.tagsEnable]: 'settings/tags/enable/',
  [SettingsType.tagsDisable]: 'settings/tags/disable/',
  [SettingsType.tagsMappings]: 'settings/tags/mappings/',
  [SettingsType.tagsMappingsChild]: 'settings/tags/mappings/child/',
  [SettingsType.tagsMappingsChildAdd]: 'settings/tags/mappings/child/add/',
  [SettingsType.tagsMappingsChildRemove]: 'settings/tags/mappings/child/remove/',
  [SettingsType.tagsMappingsParent]: 'settings/tags/mappings/parent/',
  [SettingsType.tagsMappingsParentRemove]: 'settings/tags/mappings/parent/remove/',
};

export function fetchSettings(settingsType: SettingsType, query: string) {
  const path = SettingsTypePaths[settingsType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<Settings>(`${path}${queryString}`);
}

export function updateCategorySettings(settingsType: SettingsType, payload: SettingsCategoryPayload) {
  const path = SettingsTypePaths[settingsType];
  return axiosInstance.put(`${path}`, payload);
}

export type UpdateCurrencySettingsArgs =
  | { settingsType: SettingsType.currencyAdd; payload: SettingsRatePayload }
  | { settingsType: SettingsType.currencyDelete; uuid: string }
  | { settingsType: SettingsType.currencyEdit; payload: SettingsRatePayload; uuid: string }
  | { settingsType: SettingsType.currencyEnable | SettingsType.currencyDisable; code: string };

export function updateCurrencySettings(args: UpdateCurrencySettingsArgs) {
  const path = SettingsTypePaths[args.settingsType];

  switch (args.settingsType) {
    case SettingsType.currencyAdd:
      return axiosInstance.post(`${path}`, args.payload);
    case SettingsType.currencyDelete:
      return axiosInstance.delete(`${path}${args.uuid}/`);
    case SettingsType.currencyEdit:
      return axiosInstance.put(`${path}${args.uuid}/`, args.payload);
    case SettingsType.currencyEnable:
      return axiosInstance.post(`${path}${args.code}/`);
    case SettingsType.currencyDisable:
      return axiosInstance.delete(`${path}${args.code}/`);
  }
}

export function updatePlatformSettings(settingsType: SettingsType, payload: SettingsPlatformPayload[]) {
  const path = SettingsTypePaths[settingsType];
  return axiosInstance.put(`${path}`, payload);
}

export function updateTagSettings(settingsType: SettingsType, payload: SettingsTagPayload) {
  const path = SettingsTypePaths[settingsType];
  return axiosInstance.put(`${path}`, payload);
}
