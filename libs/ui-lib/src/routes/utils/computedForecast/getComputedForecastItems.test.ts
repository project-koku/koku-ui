import { SortDirection } from '../sort';
import { getComputedForecastItems, getUnsortedComputedForecastItems } from './getComputedForecastItems';

const makeForecast = (values: any[]) => ({ data: [{ values }] });

describe('./routes/utils/computedForecast/getComputedForecastItems', () => {
  test('returns empty array if forecast missing', () => {
    expect(getUnsortedComputedForecastItems({ forecast: undefined as any })).toEqual([]);
  });

  test('builds daily items without merging', () => {
    const forecast = makeForecast([
      {
        date: '2025-01-01',
        cost: { total: { value: 1, units: 'USD' } },
      },
      {
        date: '2025-01-02',
        cost: { total: { value: 2, units: 'USD' } },
      },
    ] as any);
    const items = getUnsortedComputedForecastItems({ forecast });
    expect(items).toHaveLength(2);
    expect(items[0].date).toBe('2025-01-01');
    expect(items[1].date).toBe('2025-01-02');
  });

  test('merges monthly items by date', () => {
    const forecast = makeForecast([
      {
        date: '2025-01-01',
        cost: { total: { value: 1, units: 'USD' }, confidence_max: { value: 3, units: 'USD' }, confidence_min: { value: 1, units: 'USD' } },
      },
      {
        date: '2025-01-01',
        cost: { total: { value: 2, units: 'USD' }, confidence_max: { value: 5, units: 'USD' }, confidence_min: { value: 2, units: 'USD' } },
      },
    ] as any);
    const items = getUnsortedComputedForecastItems({ forecast });
    expect(items).toHaveLength(1);
    expect(items[0].date).toBe('2025-01-01');
    expect(items[0].cost?.total?.units).toBe('USD');
  });

  test('sorts by date using internal order', () => {
    const forecast = makeForecast([
      { date: '2025-01-02', cost: { total: { value: 2, units: 'USD' } } },
      { date: '2025-01-01', cost: { total: { value: 1, units: 'USD' } } },
    ] as any);
    const asc = getComputedForecastItems({ forecast, sortDirection: SortDirection.asc, sortKey: 'date' });
    const desc = getComputedForecastItems({ forecast, sortDirection: SortDirection.desc, sortKey: 'date' });
    // sort.ts sorts "desc" for asc and vice-versa per custom comparator
    expect(asc.map(i => i.date)).toEqual(['2025-01-02', '2025-01-01']);
    expect(desc.map(i => i.date)).toEqual(['2025-01-01', '2025-01-02']);
  });
}); 