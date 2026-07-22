import { axiosInstance } from 'api';

import { AccountSettingsType, fetchAccountSettings, updateAccountSettings } from './accountSettings';

test('fetchSettings API request for account settings', () => {
  fetchAccountSettings(AccountSettingsType.settings);
  expect(axiosInstance.get).toHaveBeenCalledWith('account-settings/');
});

test('fetchAccountSettings API request for data retention', () => {
  fetchAccountSettings(AccountSettingsType.dataRetention);
  expect(axiosInstance.get).toHaveBeenCalledWith('account-settings/data-retention/');
});

test('updateAccountSettings API request to update currency', () => {
  updateAccountSettings(AccountSettingsType.currency, { currency: 'EUR' });
  expect(axiosInstance.put).toHaveBeenCalledWith('account-settings/currency/', { currency: 'EUR' });
});

test('updateAccountSettings API request to update data retention', () => {
  updateAccountSettings(AccountSettingsType.dataRetention, { data_retention_months: 6 });
  expect(axiosInstance.put).toHaveBeenCalledWith('account-settings/data-retention/', { data_retention_months: 6 });
});
