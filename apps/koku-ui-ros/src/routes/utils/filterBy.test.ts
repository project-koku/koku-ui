import { getExcludeValuesById, getFilterValuesById } from './filterBy';

describe('getFilterValuesById', () => {
  test('returns all filter values for id', () => {
    const query = { filter_by: { name: ['foo', 'bar'] } };
    expect(getFilterValuesById(query, 'name')).toEqual(['foo', 'bar']);
  });

  test('returns single filter value for id', () => {
    const query = { filter_by: { name: 'foo' } };
    expect(getFilterValuesById(query, 'name')).toBe('foo');
  });

  test('returns undefined when filter is missing or empty', () => {
    expect(getFilterValuesById({}, 'name')).toBeUndefined();
    expect(getFilterValuesById(undefined, 'name')).toBeUndefined();
    expect(getFilterValuesById({ filter_by: { name: [] } }, 'name')).toBeUndefined();
  });
});

describe('getExcludeValuesById', () => {
  test('returns all exclude values for id', () => {
    const query = { exclude: { project: ['test1', 'test2'] } };
    expect(getExcludeValuesById(query, 'project')).toEqual(['test1', 'test2']);
  });

  test('returns single exclude value for id', () => {
    const query = { exclude: { cluster: 'cluster-1' } };
    expect(getExcludeValuesById(query, 'cluster')).toBe('cluster-1');
  });

  test('returns undefined when exclude is missing or empty', () => {
    expect(getExcludeValuesById({}, 'project')).toBeUndefined();
    expect(getExcludeValuesById(undefined, 'project')).toBeUndefined();
    expect(getExcludeValuesById({ exclude: { project: [] } }, 'project')).toBeUndefined();
  });
});
