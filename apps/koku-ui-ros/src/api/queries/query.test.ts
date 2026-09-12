import { logicalAndPrefix, logicalOrPrefix } from 'utils/props';

import { convertFilterBy, getQuery, getQueryRoute, parseFilterByPrefix, parseGroupByPrefix, parseQuery } from './query';

describe('api/queries/query', () => {
  test('convertFilterBy is a no-op without filter_by', () => {
    const query = { limit: 10 };
    expect(convertFilterBy(query)).toBe(query);
  });

  test('convertFilterBy moves filter_by into filter arrays', () => {
    expect(
      convertFilterBy({
        filter: { project: 'existing' },
        filter_by: { project: 'added', cluster: 'c1' },
      })
    ).toEqual({
      filter: { project: ['existing', 'added'], cluster: 'c1' },
      filter_by: undefined,
    });
  });

  test('convertFilterBy ignores star filters when combining', () => {
    expect(
      convertFilterBy({
        filter: { project: '*' },
        filter_by: { project: 'added' },
      }).filter.project
    ).toEqual(['added']);
  });

  test('getQuery converts filter_by and getQueryRoute does not', () => {
    const query = { filter_by: { project: 'app' }, limit: 5 };
    expect(getQuery(query)).toContain('filter');
    expect(getQuery(query)).not.toContain('filter_by');
    expect(getQueryRoute(query)).toContain('filter_by');
  });

  test('parseFilterByPrefix and parseGroupByPrefix strip logical prefixes', () => {
    expect(
      parseFilterByPrefix({
        filter_by: {
          [`${logicalOrPrefix}project`]: 'app',
          [`${logicalAndPrefix}cluster`]: 'c1',
        },
      }).filter_by
    ).toEqual({ project: 'app', cluster: 'c1' });

    expect(parseFilterByPrefix({ limit: 1 } as any)).toEqual({ limit: 1 });
    expect(
      parseGroupByPrefix({
        group_by: { [`${logicalOrPrefix}project`]: 'app' },
      }).group_by
    ).toEqual({ project: 'app' });
    expect(parseGroupByPrefix({ limit: 1 } as any)).toEqual({ limit: 1 });
  });

  test('parseQuery parses and strips prefixes', () => {
    const parsed = parseQuery(`?filter_by[${logicalOrPrefix}project]=app&group_by[${logicalAndPrefix}cluster]=c1`);
    expect(parsed.filter_by.project).toBe('app');
    expect(parsed.group_by.cluster).toBe('c1');
  });
});
