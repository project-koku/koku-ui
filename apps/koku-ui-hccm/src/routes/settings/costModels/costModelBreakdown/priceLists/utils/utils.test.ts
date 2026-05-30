import { getFilteredPriceLists, getPaginatedPriceLists } from './utils';

const priceLists = [
  { uuid: '1', name: 'Standard' },
  { uuid: '2', name: 'Premium List' },
  { uuid: '3', name: 'Other' },
] as any[];

describe('priceLists/utils', () => {
  describe('getFilteredPriceLists', () => {
    test('returns empty array when input is nullish', () => {
      expect(getFilteredPriceLists(null as any, {})).toEqual([]);
      expect(getFilteredPriceLists(undefined as any, {})).toEqual([]);
    });

    test('returns all when no filters', () => {
      expect(getFilteredPriceLists(priceLists, {})).toEqual(priceLists);
    });

    test('filters by name', () => {
      expect(getFilteredPriceLists(priceLists, { name: ['premium'] })).toEqual([priceLists[1]]);
    });
  });

  describe('getPaginatedPriceLists', () => {
    test('paginates results', () => {
      expect(getPaginatedPriceLists(priceLists, 1, 2)).toEqual([priceLists[0], priceLists[1]]);
      expect(getPaginatedPriceLists(priceLists, 2, 2)).toEqual([priceLists[2]]);
    });
  });
});
