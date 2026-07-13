import { CriteriaType } from 'routes/components/dataToolbar/utils/criteria';

import { addFilterToQuery, addQueryFilter, removeFilterFromQuery, removeQueryFilter } from './filter';

const baseQuery = {
  filter_by: { name: ['existing'] },
  group_by: { name: '*' },
};

describe('addFilterToQuery', () => {
  test('adds include filter to query', () => {
    const result = addFilterToQuery(baseQuery, { type: 'name', value: 'new' });

    expect(result.filter_by.name).toEqual(['existing', 'new']);
  });

  test('adds exact and exclude filters with correct keys', () => {
    const exactResult = addFilterToQuery(baseQuery, {
      type: 'name',
      value: 'exact-name',
      excludeType: CriteriaType.exact,
    });
    expect(exactResult.filter_by['exact:name']).toEqual(['exact-name']);

    const excludeResult = addFilterToQuery(baseQuery, {
      type: 'cluster',
      value: 'cluster-1',
      excludeType: CriteriaType.exclude,
    });
    expect(excludeResult.exclude.cluster).toEqual(['cluster-1']);
  });

  test('does not duplicate existing filter values', () => {
    const result = addFilterToQuery(baseQuery, { type: 'name', value: 'existing' });

    expect(result.filter_by.name).toEqual(['existing']);
  });

  test('replaces filter when not multi select', () => {
    const result = addFilterToQuery(baseQuery, { type: 'name', value: 'single' }, false);

    expect(result.filter_by.name).toEqual(['single']);
  });
});

describe('addQueryFilter', () => {
  test('returns undefined when wildcard matches group_by', () => {
    const query = { group_by: { name: '*' } };
    const result = addQueryFilter(query, 'name', '*', 'filter_by' as any);

    expect(result).toBeUndefined();
  });

  test('converts single value to array when adding second value', () => {
    const query = { filter_by: { name: 'single' } };
    const result = addQueryFilter(query, 'name', 'second', 'filter_by' as any);

    expect(result.filter_by.name).toEqual(['single', 'second']);
  });
});

describe('removeFilterFromQuery', () => {
  test('clears all filters when filter is null', () => {
    const query = {
      filter_by: { name: ['a'] },
      exclude: { cluster: ['b'] },
    };
    const result = removeFilterFromQuery(query, null);

    expect(result.filter_by).toBeUndefined();
    expect(result.exclude).toBeUndefined();
  });

  test('removes a specific filter value', () => {
    const query = { filter_by: { name: ['a', 'b', 'c'] } };
    const result = removeFilterFromQuery(query, { type: 'name', value: 'b' });

    expect(result.filter_by.name).toEqual(['a', 'c']);
  });

  test('removes exact and exclude filters', () => {
    const query = {
      filter_by: { 'exact:name': ['exact-value'] },
      exclude: { cluster: ['cluster-1'] },
    };

    const exactResult = removeFilterFromQuery(query, {
      type: 'name',
      value: 'exact-value',
      excludeType: CriteriaType.exact,
    });
    expect(exactResult.filter_by['exact:name']).toEqual([]);

    const excludeResult = removeFilterFromQuery(query, {
      type: 'cluster',
      value: 'cluster-1',
      excludeType: CriteriaType.exclude,
    });
    expect(excludeResult.exclude.cluster).toEqual([]);
  });
});

describe('removeQueryFilter', () => {
  test('clears all values for a filter type', () => {
    const query = { filter_by: { name: ['a', 'b'] } };
    const result = removeQueryFilter(query, 'name', null, 'filter_by' as any);

    expect(result.filter_by.name).toBeUndefined();
  });

  test('clears single value filter', () => {
    const query = { filter_by: { name: 'single' } };
    const result = removeQueryFilter(query, 'name', 'single', 'filter_by' as any);

    expect(result.filter_by.name).toBeUndefined();
  });
});
