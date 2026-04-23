import { axiosInstance } from 'api';

import { fetchPriceList, PriceListType, updatePriceList } from './priceList';

test('fetchPriceList API request', () => {
  fetchPriceList(PriceListType.priceList, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('price-lists/');
});

test('fetchPriceList appends query string when provided', () => {
  fetchPriceList(PriceListType.priceList, 'limit=10&offset=0');
  expect(axiosInstance.get).toHaveBeenCalledWith('price-lists/?limit=10&offset=0');
});

test('updatePriceList uses POST for add', () => {
  const payload = { name: 'new', currency: 'USD' } as any;
  updatePriceList(PriceListType.priceListAdd, '', payload);
  expect(axiosInstance.post).toHaveBeenCalledWith('price-lists/', payload);
});

test('updatePriceList uses DELETE for remove', () => {
  updatePriceList(PriceListType.priceListRemove, 'abc');
  expect(axiosInstance.delete).toHaveBeenCalledWith('price-lists/abc');
});

test('updatePriceList uses PUT for update', () => {
  const payload = { enable: false } as any;
  updatePriceList(PriceListType.priceListUpdate, 'abc', payload);
  expect(axiosInstance.put).toHaveBeenCalledWith('price-lists/abc', payload);
});
