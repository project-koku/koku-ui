import { getComputedReportItems, getUnsortedComputedReportItems } from './getComputedReportItems';

jest.mock('@koku-ui/i18n/i18n/intl', () => ({
  __esModule: true,
  default: {
    formatMessage: (msg: any, vals: any) => (msg && msg.id ? `${msg.id}:${JSON.stringify(vals || {})}` : JSON.stringify(vals || {})),
  },
}));

jest.mock('./getItemLabel', () => ({
  __esModule: true,
  getItemLabel: jest.fn(() => 'id'),
}));

const { getItemLabel } = require('./getItemLabel');

const makeReport = (data: any[], meta: any = {}) => ({ data, meta } as any);

const baseVal = (over: any = {}) => ({
  date: '2025-01-01',
  id: 'A',
  cost: {
    distributed: { value: 1, units: 'USD' },
    markup: { value: 1, units: 'USD' },
    network_unattributed_distributed: { value: 1, units: 'USD' },
    platform_distributed: { value: 1, units: 'USD' },
    raw: { value: 1, units: 'USD' },
    storage_unattributed_distributed: { value: 1, units: 'USD' },
    total: { value: 1, units: 'USD' },
    usage: { value: 1, units: 'USD' },
    worker_unallocated_distributed: { value: 1, units: 'USD' },
    value: 1,
    units: 'USD',
  },
  infrastructure: {
    total: { value: 1, units: 'USD' },
    raw: { value: 1, units: 'USD' },
  },
  supplementary: {
    total: { value: 1, units: 'USD' },
    raw: { value: 1, units: 'USD' },
  },
  usage: { value: 1, units: 'Core-Hours' },
  request: { cpu: { value: 1, units: 'Core-Hours' }, memory: { value: 1, units: 'Core-Hours' }, value: 2, units: 'Core-Hours', unused: 0.5, unused_percent: 50 },
  capacity: { value: 2, units: 'Core-Hours', count: 1, count_units: 'cores', unused: 0.5, unused_percent: 25 },
  limit: { value: 3, units: 'Core-Hours' },
  clusters: ['alpha'],
  cluster: 'c1',
  ...over,
});

describe('routes/utils/computedReport/getComputedReportItems (more)', () => {
  beforeEach(() => {
    (getItemLabel as jest.Mock).mockReset().mockReturnValue('id');
  });

  test('isGroupBy with nested arrays triggers recursion branch', () => {
    const report = makeReport([
      { type: 'outer', nested: [{ type: 'inner', values: [baseVal({ id: 'X' })] }] },
    ]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('X');
  });

  test('clusters merge and sort uniquely across duplicates', () => {
    const one = baseVal({ id: 'M', clusters: ['beta'], cluster: 'c2' });
    const two = baseVal({ id: 'M', clusters: ['alpha'], cluster: 'c2' });
    const report = makeReport([{ type: 't', values: [one, two] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    expect(items).toHaveLength(1);
    expect(items[0].clusters).toEqual(['alpha', 'beta']);
  });

  test('date map stores multiple dates for same id', () => {
    const first = baseVal({ id: 'DM', date: '2025-01-01' });
    const second = baseVal({ id: 'DM', date: '2025-01-02' });
    const report = makeReport([{ type: 't', values: [first, second] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report, isDateMap: true });
    expect(items).toHaveLength(1);
    const map = items[0] as Map<string, any>;
    expect(Array.from(map.keys())).toEqual(['2025-01-01', '2025-01-02']);
  });

  test('map id uses id-cluster suffix when idKey not date/cluster', () => {
    const a = baseVal({ id: 'SAME', cluster: 'c1' });
    const b = baseVal({ id: 'SAME', cluster: 'c2' });
    const report = makeReport([{ type: 't', values: [a, b] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'account', report });
    expect(items).toHaveLength(2);
  });

  test('label "Others" uses message with count', () => {
    const other = baseVal({ id: 'Other' });
    const report = makeReport([{ type: 't', values: [other] }], { others: 5 });
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    expect(items[0].label).toContain('chartOthers');
  });

  test('label resolution via getItemLabel paths', () => {
    (getItemLabel as jest.Mock).mockReturnValue('org_entities');
    let r = makeReport([{ type: 't', values: [baseVal({ id: 'L1', alias: 'Alias1' })] }]);
    let items = getUnsortedComputedReportItems({ idKey: 'org_entities', report: r });
    expect(items[0].label).toBe('Alias1');

    (getItemLabel as jest.Mock).mockReturnValue('account');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L2', account_alias: 'Acct' })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'account', report: r });
    expect(items[0].label).toBe('Acct');

    (getItemLabel as jest.Mock).mockReturnValue('cluster');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L3', clusters: ['aliasC'], cluster: 'cid' })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'cluster', report: r });
    expect(items[0].label).toBe('aliasC');

    (getItemLabel as jest.Mock).mockReturnValue('subscription_guid');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L4', subscription_name: 'SubName' })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'subscription_guid', report: r });
    expect(items[0].label).toBe('SubName');

    (getItemLabel as jest.Mock).mockReturnValue('resource_id');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L5', instance_name: 'VmName' })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'resource_id', report: r });
    expect(items[0].label).toBe('VmName');

    (getItemLabel as jest.Mock).mockReturnValue('object_key');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L6', object_key: { value: 'ObjVal' } })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'object_key', report: r });
    expect(items[0].label).toBe('ObjVal');

    (getItemLabel as jest.Mock).mockReturnValue('empty_key');
    r = makeReport([{ type: 't', values: [baseVal({ id: 'L7', alias: '   ' })] }]);
    items = getUnsortedComputedReportItems({ idKey: 'id', report: r });
    expect(items[0].label).toBe('L7');
  });

  test('sums usage and cost fields across duplicates including nested structures', () => {
    const v1 = baseVal({ id: 'SUM', request: { cpu: { value: 1, units: 'Core-Hours' }, memory: { value: 2, units: 'Core-Hours' }, value: 3, units: 'Core-Hours', unused: 0.1, unused_percent: 10 }, capacity: { value: 5, units: 'Core-Hours', count: 2, count_units: 'cores', unused: 1, unused_percent: 20 }, usage: { value: 7, units: 'Core-Hours' } });
    const v2 = baseVal({ id: 'SUM', request: { cpu: { value: 2, units: 'Core-Hours' }, memory: { value: 3, units: 'Core-Hours' }, value: 4, units: 'Core-Hours', unused: 0.2, unused_percent: 5 }, capacity: { value: 6, units: 'Core-Hours', count: 3, count_units: 'cores', unused: 2, unused_percent: 5 }, usage: { value: 8, units: 'Core-Hours' } });
    const report = makeReport([{ type: 't', values: [v1, v2] }]);
    const items = getUnsortedComputedReportItems({ idKey: 'id', report });
    const item = items[0];
    expect(item.request?.cpu?.value).toBe(3);
    expect(item.request?.memory?.value).toBe(5);
    expect(item.request?.value).toBe(7);
    expect(item.capacity?.value).toBe(11);
    expect(item.usage?.value).toBe(15);
    expect(item.cost?.total?.value).toBe(2); // 1 + 1 from each
    expect(item.cost?.raw?.value).toBe(2);
    expect(item.infrastructure?.raw?.value).toBe(2);
    expect(item.supplementary?.raw?.value).toBe(2);
  });

  test('computed items are sortable using getComputedReportItems', () => {
    const a = baseVal({ id: 'S1', date: '2025-01-01' });
    const b = baseVal({ id: 'S2', date: '2025-01-02' });
    const report = makeReport([{ type: 't', values: [b, a] }]);
    const asc = getComputedReportItems({ idKey: 'id', report, sortKey: 'date' });
    const desc = getComputedReportItems({ idKey: 'id', report, sortKey: 'date', sortDirection: 1 as any });
    expect(asc[0].date >= asc[1].date).toBeTruthy();
    expect(desc[0].date <= desc[1].date).toBeTruthy();
  });
}); 