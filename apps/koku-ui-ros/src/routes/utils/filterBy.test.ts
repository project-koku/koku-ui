import { getExcludeById, getFilterById } from './filterBy';

describe('getFilterById', () => {
  test('returns first filter value for id', () => {
    const query = { filter_by: { name: ['foo', 'bar'] } };
    expect(getFilterById(query, 'name')).toBe('foo');
  });

  test('returns undefined when filter is missing', () => {
    expect(getFilterById({}, 'name')).toBeUndefined();
    expect(getFilterById(undefined, 'name')).toBeUndefined();
  });
});

describe('getExcludeById', () => {
  test('returns first exclude value for id', () => {
    const query = { exclude: { cluster: ['cluster-1', 'cluster-2'] } };
    expect(getExcludeById(query, 'cluster')).toBe('cluster-1');
  });

  test('returns undefined when exclude is missing', () => {
    expect(getExcludeById({}, 'cluster')).toBeUndefined();
    expect(getExcludeById(undefined, 'cluster')).toBeUndefined();
  });
});
