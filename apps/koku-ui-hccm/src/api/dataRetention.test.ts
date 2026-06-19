import { axiosInstance } from 'api';

import { DataRetentionType, fetchDataRetention, updateDataRetention } from './dataRetention';

test('fetchDataRetention API request', () => {
  fetchDataRetention(DataRetentionType.dataRetention, undefined, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('price-lists/');
});

test('fetchDataRetention appends uuid and query string when provided', () => {
  fetchDataRetention(DataRetentionType.dataRetention, 'abc-123', 'limit=10&offset=0');
  expect(axiosInstance.get).toHaveBeenCalledWith('price-lists/abc-123/?limit=10&offset=0');
});

test('updateDataRetention uses POST by default', () => {
  const payload = { name: 'retention' } as any;
  updateDataRetention(DataRetentionType.dataRetention, undefined, payload);
  expect(axiosInstance.post).toHaveBeenCalledWith('price-lists/', payload);
});

test('updateDataRetention uses PUT for dataRetentionUpdate', () => {
  const payload = { name: 'updated' } as any;
  updateDataRetention(DataRetentionType.dataRetentionUpdate, 'abc-123', payload);
  expect(axiosInstance.put).toHaveBeenCalledWith('price-lists/abc-123/', payload);
});
