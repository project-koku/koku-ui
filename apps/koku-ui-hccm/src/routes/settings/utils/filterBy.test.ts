import type { Query } from 'api/queries/query';

import { getExcludeValuesById, getFilterValuesById } from './filterBy';

describe('filterBy helpers', () => {
  test('returns stored values', () => {
    const query = {
      exclude: { project: ['skip'] },
      filter_by: { cluster: 'east' },
    } as Query;

    expect(getExcludeValuesById(query, 'project')).toEqual(['skip']);
    expect(getFilterValuesById(query, 'cluster')).toBe('east');
  });

  test('returns undefined for missing or empty values', () => {
    const query = { exclude: { project: [] }, filter_by: { cluster: null } } as Query;
    expect(getExcludeValuesById(query, 'project')).toBeUndefined();
    expect(getExcludeValuesById(query, 'missing')).toBeUndefined();
    expect(getFilterValuesById(query, 'cluster')).toBeUndefined();
    expect(getFilterValuesById({} as Query, 'cluster')).toBeUndefined();
  });
});
