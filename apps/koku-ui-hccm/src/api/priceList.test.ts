import { axiosInstance } from 'api';

import { fetchPriceList, PriceListType } from './priceList';

test('fetchPriceList API request', () => {
  fetchPriceList(PriceListType.priceList, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('priceList/');
});
