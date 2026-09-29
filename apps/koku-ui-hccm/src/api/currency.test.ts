import { axiosInstance } from 'api';

import { CurrencyType, fetchCurrency } from './currency';

test('fetchCurrency requests the currency list', () => {
  fetchCurrency(CurrencyType.currency, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('currency/');
});

test('fetchCurrency appends a query string when one is provided', () => {
  fetchCurrency(CurrencyType.currency, 'limit=1000');
  expect(axiosInstance.get).toHaveBeenCalledWith('currency/?limit=1000');
});
