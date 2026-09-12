import { DateRangeType, getDateRange, getDateRangeFromQuery, getDateRangeTypeDefault } from './dateRange';
import { isEqual } from './equal';
import { getGroupById, getGroupByValue } from './groupBy';
import { noop } from './noop';
import { getOrderById, getOrderByValue } from './orderBy';
import { getBreakdownPath, getOptimizationsBreakdownPath } from './paths';
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
import {
  handleOnCostDistributionSelect as navigateCostDistribution,
  handleOnCostTypeSelect as navigateCostType,
  handleOnCurrencySelect as navigateCurrency,
  handleOnFilterAdded as navigateFilterAdded,
  handleOnFilterRemoved as navigateFilterRemoved,
  handleOnPerPageSelect as navigatePerPage,
  handleOnSetPage as navigateSetPage,
  handleOnSort as navigateSort,
} from './queryNavigate';
import { clearQueryState, getQueryState } from './queryState';
import { skeletonWidth } from './skeleton';
import { sort, SortDirection } from './sort';
import { CriteriaType } from 'routes/components/dataToolbar/utils/criteria';

jest.mock('utils/dates', () => ({
  formatStartEndDate: (start: Date, end: Date) => ({ start_date: start.toISOString(), end_date: end.toISOString() }),
  getCurrentMonthDate: () => ({ start_date: 'current-start', end_date: 'current-end' }),
  getLast30DaysDate: () => ({ start_date: '30-start', end_date: '30-end' }),
  getLast60DaysDate: () => ({ start_date: '60-start', end_date: '60-end' }),
  getLast90DaysDate: () => ({ start_date: '90-start', end_date: '90-end' }),
}));

describe('routes/utils', () => {
  test('date range helpers', () => {
    expect(getDateRange(DateRangeType.currentMonthToDate)).toEqual({
      start_date: 'current-start',
      end_date: 'current-end',
    });
    expect(getDateRange(DateRangeType.lastThirtyDays).start_date).toBe('30-start');
    expect(getDateRange(DateRangeType.lastSixtyDays).start_date).toBe('60-start');
    expect(getDateRange(DateRangeType.lastNinetyDays).start_date).toBe('90-start');
    expect(getDateRange(DateRangeType.previousMonth).start_date).toBeDefined();
    expect(getDateRange(DateRangeType.previousMonthToDate).start_date).toBeDefined();
    expect(getDateRangeTypeDefault({} as any)).toBe(DateRangeType.currentMonthToDate);
    expect(getDateRangeTypeDefault({ dateRangeType: DateRangeType.lastThirtyDays } as any)).toBe(
      DateRangeType.lastThirtyDays
    );
    expect(getDateRangeFromQuery({ dateRangeType: DateRangeType.custom, start_date: 'a', end_date: 'b' } as any)).toEqual(
      { start_date: 'a', end_date: 'b' }
    );
    expect(getDateRangeFromQuery({} as any).start_date).toBe('current-start');
  });

  test('isEqual, noop, skeleton, sort, groupBy, and orderBy', () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(noop()).toBeUndefined();
    expect(skeletonWidth.md).toBe('66%');
    expect(sort(['b', 'a'], { direction: SortDirection.asc })).toEqual(['b', 'a']);
    expect(sort(['b', 'a'], { direction: SortDirection.desc })).toEqual(['a', 'b']);
    expect(sort([{ name: 'b' }, { name: 'a' }], { key: 'name', direction: SortDirection.asc })).toEqual([
      { name: 'b' },
      { name: 'a' },
    ]);
    expect(getGroupById({ group_by: { project: 'app' } })).toBe('project');
    expect(getGroupByValue({ group_by: { project: 'app' } })).toBe('app');
    expect(getGroupById({})).toBeUndefined();
    expect(getOrderById({ order_by: { cost: 'desc' } })).toBe('cost');
    expect(getOrderByValue({ order_by: { cost: 'desc' } })).toBe('desc');
    expect(getOrderByValue({})).toBeUndefined();
  });

  test('breakdown paths', () => {
    expect(
      getBreakdownPath({
        basePath: '/base',
        breadcrumbLabel: 'label',
        breadcrumbPath: '/crumb',
        description: 'desc',
        groupBy: 'project',
        id: 'id-1',
        isPlatformCosts: true,
        isOptimizationsTab: true,
        title: 'title',
      })
    ).toContain('/base?');
    expect(
      getOptimizationsBreakdownPath({
        basePath: '/opt',
        breadcrumbLabel: 'label',
        breadcrumbPath: '/crumb',
        id: 'id-1',
        isContainers: true,
        title: 'title',
      })
    ).toContain('/opt?');
  });

  test('query helpers', () => {
    const query = { filter: { limit: 10, offset: 20 }, offset: 20, order_by: { cost: 'asc' } };
    expect(initQuery(query, true).filter.offset).toBe(0);
    expect(initQuery(query, true).offset).toBe(0);
    expect(getRouteForQuery(query, { pathname: '/path' } as any)).toContain('/path?');
    expect(handleOnCurrencySelect(query)).toEqual(initQuery(query));
    expect(handleOnCostTypeSelect(query)).toEqual(initQuery(query));
    expect(handleOnCostDistributionSelect(query).order_by).toBeUndefined();
    expect(
      handleOnFilterAdded(query, { type: 'project', value: 'app', excludeType: CriteriaType.include })
    ).toBeDefined();
    expect(
      handleOnFilterRemoved(query, { type: 'project', value: 'app', excludeType: CriteriaType.include })
    ).toBeDefined();
    expect(handleOnPerPageSelect(query, 50).filter.limit).toBe(50);
    expect(handleOnPerPageSelect(query, 50, true).limit).toBe(50);
    expect(handleOnSetPage(query, { meta: { filter: { limit: 25 } } }, 2).filter.offset).toBe(25);
    expect(handleOnSetPage(query, { meta: { limit: 5 } }, 3, true).offset).toBe(10);
    expect(handleOnSort(query, 'cost', false, '2024-01-01').order_by).toEqual({ cost: 'desc', date: '2024-01-01' });
  });

  test('query navigate helpers call router.navigate', () => {
    const navigate = jest.fn();
    const router = { navigate, location: { pathname: '/path' } } as any;
    const query = { filter: { limit: 10, offset: 0 } };
    navigateCurrency(query, router, { keep: true });
    navigateCostType(query, router);
    navigateCostDistribution(query, router);
    navigateFilterAdded(query, router, { type: 'project', value: 'app' });
    navigateFilterRemoved(query, router, { type: 'project', value: 'app' });
    navigatePerPage(query, router, 20);
    navigateSetPage(query, router, { meta: { filter: { limit: 10 } } }, 2);
    navigateSort(query, router, 'cost', true);
    expect(navigate).toHaveBeenCalledTimes(8);
  });

  test('query state helpers', () => {
    const location = { state: { details: { interval: 'short_term' } } } as any;
    expect(getQueryState(location, 'details')).toEqual({ interval: 'short_term' });
    expect(getQueryState({} as any, 'details')).toBeUndefined();
    clearQueryState(location, 'details');
    expect(location.state.details).toBeUndefined();
    expect(() => clearQueryState({} as any, 'details')).not.toThrow();
  });
});
