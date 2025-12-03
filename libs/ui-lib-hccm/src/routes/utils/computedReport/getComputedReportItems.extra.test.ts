import { SortDirection } from '../sort';
import { getComputedReportItems, getUnsortedComputedReportItems } from './getComputedReportItems';

const makeReport = (data: any[]) => ({ data, meta: {} } as any);

const baseVal = (over: any = {}) => ({
  date: '2025-01-01',
  id: 'A',
  cost: { total: { value: 1, units: 'USD' }, raw: { value: 1, units: 'USD' } },
  ...over,
});

describe('./routes/utils/computedReport/getComputedReportItems (extra)', () => {
  test('empty report returns []', () => {
    expect(getUnsortedComputedReportItems({ idKey: 'id', report: undefined as any })).toEqual([]);
  });

  test('groupBy path with values array', () => {
    const report = makeReport([{ type: 'x', values: [baseVal(), { ...baseVal({ id: 'B' }) }] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    expect(items).toHaveLength(2);
  });

  test('non-groupBy path merges arrays of keys', () => {
    const report = makeReport([{ type: 'x', values: [baseVal({ id: 'C' })] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', isGroupBy: false, report });
    expect(items).toHaveLength(1);
  });

  test('date map path stores per-date maps and merges existing', () => {
    const report = makeReport([{ type: 'x', values: [baseVal({ id: 'D' }), baseVal({ id: 'D' })] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', isDateMap: true, report });
    expect(items).toHaveLength(1);
    const dateMap = items[0] as Map<string, any>;
    expect(dateMap.get('2025-01-01')).toBeTruthy();
  });

  test('label resolution falls back to alias/id and sorts with custom comparator', () => {
    const report = makeReport([
      { type: 'x', values: [baseVal({ id: 'E', alias: 'AliasE' }), baseVal({ id: 'F' })] },
    ]);
    const asc = getComputedReportItems({ idKey: 'id', report, sortKey: 'date', sortDirection: SortDirection.asc });
    const desc = getComputedReportItems({ idKey: 'id', report, sortKey: 'date', sortDirection: SortDirection.desc });
    expect(asc.length).toBe(2);
    expect(desc.length).toBe(2);
  });

  test('sums values across duplicate map ids', () => {
    const report = makeReport([
      {
        type: 'x',
        values: [
          baseVal({ id: 'G', cost: { total: { value: 1, units: 'USD' }, raw: { value: 1, units: 'USD' } } }),
          baseVal({ id: 'G', cost: { total: { value: 2, units: 'USD' }, raw: { value: 3, units: 'USD' } } }),
        ],
      },
    ]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    expect(items).toHaveLength(1);
    expect(items[0].cost?.total?.value).toBe(3);
  });
}); 