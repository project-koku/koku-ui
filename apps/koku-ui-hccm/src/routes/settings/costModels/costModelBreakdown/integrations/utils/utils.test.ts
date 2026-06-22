import { getFilteredSources, getPaginatedSources } from './utils';

const sources = [
  { uuid: '1', name: 'Alpha Cluster' },
  { uuid: '2', name: 'Beta Cluster' },
  { uuid: '3', name: 'Gamma' },
] as any[];

describe('integrations/utils', () => {
  describe('getFilteredSources', () => {
    test('returns empty array when sources is nullish', () => {
      expect(getFilteredSources(null as any, {})).toEqual([]);
      expect(getFilteredSources(undefined as any, {})).toEqual([]);
    });

    test('returns all sources when no name filters', () => {
      expect(getFilteredSources(sources, {})).toEqual(sources);
      expect(getFilteredSources(sources, { name: [] })).toEqual(sources);
    });

    test('filters by name case-insensitively', () => {
      expect(getFilteredSources(sources, { name: ['beta'] })).toEqual([sources[1]]);
      expect(getFilteredSources(sources, { name: ['CLUSTER'] })).toHaveLength(2);
    });
  });

  describe('getPaginatedSources', () => {
    test('returns slice for page and perPage', () => {
      expect(getPaginatedSources(sources, 1, 2)).toEqual([sources[0], sources[1]]);
      expect(getPaginatedSources(sources, 2, 2)).toEqual([sources[2]]);
    });

    test('returns empty when sources is empty', () => {
      expect(getPaginatedSources([], 1, 10)).toEqual([]);
    });
  });
});
