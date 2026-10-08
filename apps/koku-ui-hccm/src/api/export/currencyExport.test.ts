import { axiosInstance } from 'api';
import { SettingsType } from 'api/settings';

import { runExport } from './currencyExport';

test('runExport API request for currency', () => {
  runExport(SettingsType.currency, 'limit=10');
  expect(axiosInstance.get).toHaveBeenCalledWith('settings/currency/?limit=10', {
    headers: { Accept: 'text/csv' },
  });
});
