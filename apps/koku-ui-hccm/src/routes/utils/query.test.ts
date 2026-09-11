import type { Query } from 'api/queries/query';

import {
  getRouteForQuery,
  handleOnCostDistributionSelect,
  handleOnCostTypeSelect,
  handleOnCurrencySelect,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
  initQuery,
} from './query';

describe('query helpers', () => {
  const query = {
    filter: { limit: 10, offset: 20 },
    filter_by: { project: ['payments'] },
    offset: 20,
    order_by: { cost: 'desc' },
  } as Query;

  test('initQuery clones the query and optionally resets pagination', () => {
    const reset = initQuery(query, true, { group_by: { project: '*' } });
    expect(reset.filter.offset).toBe(0);
    expect(reset.offset).toBe(0);
    expect(reset.group_by).toEqual({ project: '*' });
    expect(query.filter.offset).toBe(20);
  });

  test('getRouteForQuery builds a path with the reset query string', () => {
    const route = getRouteForQuery(query, { pathname: '/explorer' } as any, true);
    expect(route.startsWith('/explorer?')).toBe(true);
    expect(route).toContain('offset');
  });

  test('select helpers clone or clear order_by', () => {
    expect(handleOnCurrencySelect(query).filter.limit).toBe(10);
    expect(handleOnCostTypeSelect(query).filter.limit).toBe(10);
    expect(handleOnCostDistributionSelect(query).order_by).toBeUndefined();
  });

  test('filter helpers add and remove values', () => {
    const added = handleOnFilterAdded(query, { type: 'cluster', value: 'east' });
    expect(added.filter_by.cluster).toEqual(['east']);
    expect(added.filter.offset).toBe(0);

    const removed = handleOnFilterRemoved(added, { type: 'cluster', value: 'east' });
    expect(removed.filter_by.cluster).toEqual([]);
  });

  test('pagination helpers support both filter.limit and top-level limit', () => {
    const nested = handleOnPerPageSelect(query, 25);
    expect(nested.filter.limit).toBe(25);
    expect(nested.filter.offset).toBe(0);

    const topLevel = handleOnPerPageSelect(query, 50, true);
    expect(topLevel.limit).toBe(50);
    expect(topLevel.offset).toBe(0);

    const page = handleOnSetPage(query, { meta: { filter: { limit: 10 } } }, 3);
    expect(page.filter.offset).toBe(20);

    const limitPage = handleOnSetPage({ ...query, offset: 0 }, { meta: { limit: 5 } }, 2, true);
    expect(limitPage.offset).toBe(5);
  });

  test('handleOnSort sets order_by and optional date', () => {
    expect(handleOnSort(query, 'usage', false).order_by).toEqual({ usage: 'desc' });
    expect(handleOnSort(query, 'cost', true, '2026-01-01').order_by).toEqual({
      cost: 'asc',
      date: '2026-01-01',
    });
  });
});
