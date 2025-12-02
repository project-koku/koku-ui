import type { PagedLinks, PagedMetaData } from './api';
import axiosInstance from './api';

export interface SettingsData {
  clusters?: string[];
  default?: boolean;
  project?: string;
  group?: string;
  uuid?: string;
  key?: string;
  enabled?: boolean;
  source_type?: string;
}

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
  enabled_tags_count?: number;
  enabled_tags_limit?: number;
}

export interface Settings {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: SettingsData;
}

export interface SettingsPayload {
  parent?: string;
  children?: string[];
  ids?: string[];
}

export const enum SettingsType {
  costCategories = 'costCategories',
  costCategoriesEnable = 'costCategoriesEnable',
  costCategoriesDisable = 'costCategoriesDisable',
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

export function updateSettings(settingsType: SettingsType, payload: SettingsPayload) {
  const path = SettingsTypePaths[settingsType];
  return axiosInstance.put(`${path}`, payload);
}
