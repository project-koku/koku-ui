import { axiosInstance } from 'api';

import { fetchSettings, SettingsType, updateSettings } from './settings';

test('fetchSettings API request for cost categories', () => {
  fetchSettings(SettingsType.costCategories, '');
  expect(axiosInstance.get).toBeCalledWith('settings/aws_category_keys/');
});

test('updateSettings API request to enable cost categories', () => {
  updateSettings(SettingsType.costCategoriesEnable, { ids: ['test'] });
  expect(axiosInstance.put).toBeCalledWith('settings/aws_category_keys/enable/', { ids: ['test'] });
});
