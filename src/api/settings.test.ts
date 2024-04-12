import { axiosInstance } from 'api';

import { fetchSettings, SettingsType } from './settings';

test('api get cost category keys', () => {
  fetchSettings(SettingsType.costCategories, '');
  expect(axiosInstance.get).toBeCalledWith('settings/aws_category_keys/');
});

test('api get platform projects', () => {
  fetchSettings(SettingsType.platformProjects, '');
  expect(axiosInstance.get).toBeCalledWith('settings/cost-groups/');
});

test('api get child tag mappings', () => {
  fetchSettings(SettingsType.tagsMappingsChild, '');
  expect(axiosInstance.get).toBeCalledWith('settings/tags/mappings/child');
});

test('api get parent tag mappings', () => {
  fetchSettings(SettingsType.tagsMappingsParent, '');
  expect(axiosInstance.get).toBeCalledWith('settings/tags/mappings/parent');
});

test('api get tag mappings', () => {
  fetchSettings(SettingsType.tagsMappings, '');
  expect(axiosInstance.get).toBeCalledWith('settings/tags/mappings');
});

test('api get tags', () => {
  fetchSettings(SettingsType.tags, '');
  expect(axiosInstance.get).toBeCalledWith('settings/tags');
});
