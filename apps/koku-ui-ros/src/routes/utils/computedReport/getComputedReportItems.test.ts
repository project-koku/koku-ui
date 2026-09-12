import { getComputedReportItems, getUnsortedComputedReportItems } from './getComputedReportItems';
import { getItemLabel } from './getItemLabel';
import { SortDirection } from 'routes/utils/sort';

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: {
    formatMessage: (_msg: unknown, values: { count?: number }) => `Others (${values.count})`,
  },
}));

const cost = {
  total: { value: 10, units: 'USD' },
  raw: { value: 8, units: 'USD' },
  markup: { value: 1, units: 'USD' },
  distributed: { value: 2, units: 'USD' },
  platform_distributed: { value: 3, units: 'USD' },
  usage: { value: 4, units: 'Core-Hours' },
  worker_unallocated_distributed: { value: 5, units: 'USD' },
};

const usage = {
  capacity: { value: 20, units: 'Core-Hours', count: 1, count_units: 'core', unused: 2, unused_percent: 10 },
  limit: { value: 15, units: 'Core-Hours' },
  request: { value: 12, units: 'Core-Hours', unused: 1, unused_percent: 5 },
  usage: { value: 9, units: 'Core-Hours' },
};

const makeReport = (values: any[], extras: any = {}) => ({
  meta: { others: 3, ...extras.meta },
  data: [
    {
      type: 'account',
      values,
      ...extras.dataPoint,
    },
  ],
});

describe('getComputedReportItems', () => {
  test('returns an empty list without a report', () => {
    expect(getUnsortedComputedReportItems({ report: undefined as any, idKey: 'project' })).toEqual([]);
  });

  test('computes a report item with cost, usage, and aliases', () => {
    const report = makeReport([
      {
        project: 'app',
        date: '2024-01-01',
        cluster: 'cluster-a',
        clusters: ['alias-a'],
        classification: 'project',
        default_project: 'True',
        delta_percent: 1,
        delta_value: 2,
        source_uuid: ['uuid'],
        persistent_volume_claim: ['pvc'],
        storage_class: ['gp2'],
        cost,
        infrastructure: cost,
        supplementary: cost,
        ...usage,
      },
    ]);

    const items = getComputedReportItems({ report: report as any, idKey: 'project' });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('app');
    expect(items[0].cluster).toBe('alias-a');
    expect(items[0].default_project).toBe(true);
    expect(items[0].cost.total.value).toBe(10);
    expect(items[0].capacity.value).toBe(20);
  });

  test('merges items that share an id and uses the Others label', () => {
    const report = makeReport(
      [
        {
          project: 'Other',
          date: '2024-01-01',
          cluster: 'cluster-a',
          cost,
          ...usage,
        },
        {
          project: 'Other',
          date: '2024-01-02',
          cluster: 'cluster-b',
          clusters: ['cluster-b'],
          cost,
          ...usage,
        },
      ],
      { meta: { others: 4 } }
    );

    const items = getUnsortedComputedReportItems({ report: report as any, idKey: 'project' });
    expect(items).toHaveLength(2);
    expect(items[0].label).toBe('Others (4)');
    expect(items[0].cost.total.value).toBe(10);
  });

  test('builds a date map and uses account aliases', () => {
    const report = makeReport([
      {
        account: '123',
        account_alias: 'acct',
        date: '2024-01-01',
        cost,
        ...usage,
      },
    ]);

    const items = getUnsortedComputedReportItems({
      report: report as any,
      idKey: 'account',
      isDateMap: true,
    });
    expect(items[0].get('2024-01-01').label).toBe('acct');
  });

  test('uses org alias and subscription name labels', () => {
    const orgReport = makeReport([{ id: 'org-1', alias: 'Org', date: '2024-01-01', cost, ...usage }]);
    const orgItems = getUnsortedComputedReportItems({ report: orgReport as any, idKey: 'org_entities' });
    expect(orgItems[0].label).toBe('Org');

    const subscriptionReport = makeReport([
      { subscription_guid: 'guid', subscription_name: 'Sub', date: '2024-01-01', cost, ...usage },
    ]);
    const subscriptionItems = getUnsortedComputedReportItems({
      report: subscriptionReport as any,
      idKey: 'subscription_guid',
    });
    expect(subscriptionItems[0].label).toBe('Sub');
  });

  test('sorts by the requested key', () => {
    const report = makeReport([
      { project: 'b', date: '2024-01-02', cost, ...usage },
      { project: 'a', date: '2024-01-01', cost, ...usage },
    ]);
    const items = getComputedReportItems({
      report: report as any,
      idKey: 'project',
      sortKey: 'id',
      sortDirection: SortDirection.desc,
    });
    expect(items.map(item => item.id)).toEqual(['a', 'b']);
  });

  test('uses object labels and alias fallbacks', () => {
    const report = makeReport([
      { project: { value: 'obj' }, date: '2024-01-01', cost, ...usage },
      { project: '   ', alias: 'From alias', date: '2024-01-02', cost, ...usage },
    ]);
    const items = getUnsortedComputedReportItems({ report: report as any, idKey: 'project' });
    expect(items.map(item => item.label)).toEqual(['obj', 'From alias']);
  });

  test('merges date map entries for the same id', () => {
    const report = makeReport([
      { account: '123', date: '2024-01-01', cost, ...usage },
      { account: '123', date: '2024-01-02', cost, ...usage },
    ]);
    const items = getUnsortedComputedReportItems({
      report: report as any,
      idKey: 'account',
      isDateMap: true,
    });
    expect(items[0].get('2024-01-01')).toBeTruthy();
    expect(items[0].get('2024-01-02')).toBeTruthy();
  });
});

describe('getItemLabel', () => {
  test('returns the id key by default', () => {
    expect(getItemLabel({ idKey: 'project', report: {}, value: {} })).toBe('project');
  });

  test('returns the id key when a tag prefix is not matched', () => {
    expect(
      getItemLabel({
        idKey: 'app',
        report: { meta: { group_by: { 'tag:app': ['x'] } } },
        value: { 'tag:app': 'web' },
      })
    ).toBe('app');
  });
});
