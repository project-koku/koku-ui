import { axiosInstance } from 'api';

import { AccountSettingsType, fetchAccountSettings, updateAccountSettings } from './accountSettings';

test('fetchSettings API request for account settings', () => {
  fetchAccountSettings(AccountSettingsType.settings);
  expect(axiosInstance.get).toBeCalledWith('account-settings/');
});

test('updateAccountSettings API request to update currency', () => {
  updateAccountSettings(AccountSettingsType.currency, { currency: 'EUR' });
  expect(axiosInstance.put).toBeCalledWith('account-settings/currency/', { currency: 'EUR' });
});
