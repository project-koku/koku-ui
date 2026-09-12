import type { Query } from 'api/queries/query';
import { awsCategoryPrefix, exactPrefix, orgUnitIdKey, tagPrefix } from 'utils/props';

import {
  getExcludeTagKey,
  getFilterByTagKey,
  getGroupByCostCategory,
  getGroupById,
  getGroupByOrgValue,
  getGroupByTagKey,
  getGroupByValue,
} from './groupBy';

describe('groupBy helpers', () => {
  test('returns undefined when group_by is missing', () => {
    const query = {} as Query;
    expect(getGroupById(query)).toBeUndefined();
    expect(getGroupByValue(query)).toBeUndefined();
    expect(getGroupByOrgValue(query)).toBeUndefined();
    expect(getGroupByCostCategory(query)).toBeUndefined();
    expect(getGroupByTagKey(query)).toBeUndefined();
    expect(getExcludeTagKey(query)).toBeUndefined();
    expect(getFilterByTagKey(query)).toBeUndefined();
  });

  test('skips org unit keys when resolving the primary group by', () => {
    const query = {
      group_by: {
        [orgUnitIdKey]: 'org-1',
        project: 'payments',
      },
    } as Query;

    expect(getGroupById(query)).toBe('project');
    expect(getGroupByValue(query)).toBe('payments');
    expect(getGroupByOrgValue(query)).toBe('org-1');
  });

  test('returns the org unit value when it is the only group by', () => {
    const query = { group_by: { [orgUnitIdKey]: 'sales' } } as Query;
    expect(getGroupById(query)).toBeUndefined();
    expect(getGroupByValue(query)).toBeUndefined();
    expect(getGroupByOrgValue(query)).toBe('sales');
  });

  test('extracts cost category and tag keys from prefixes', () => {
    const query = {
      group_by: {
        [`${awsCategoryPrefix}env`]: 'prod',
        [`${tagPrefix}owner`]: 'platform',
      },
    } as Query;

    expect(getGroupByCostCategory(query)).toBe('env');
    expect(getGroupByTagKey(query)).toBe('owner');
  });

  test('extracts exclude and filter_by tag keys, including exact prefixes', () => {
    expect(getExcludeTagKey({ exclude: { [`${tagPrefix}app`]: 'cost' } } as Query)).toBe('app');
    expect(getFilterByTagKey({ filter_by: { [`${exactPrefix}${tagPrefix}team`]: 'hccm' } } as Query)).toBe('team');
    expect(getFilterByTagKey({ filter_by: { [`${tagPrefix}cluster`]: 'east' } } as Query)).toBe('cluster');
  });
});
