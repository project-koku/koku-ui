import {
  getComputedAwsReportItems,
  getIdKeyForGroupBy,
} from './getComputedAwsReportItems';

test('get id key for groupBy', () => {
  [
    [{ account: 's', instance_type: 's' }, 'account'],
    [{ instance_type: 's', region: 's' }, 'instance_type'],
    [{ region: 's', service: 's' }, 'region'],
    [{ service: 's' }, 'service'],
    [{}, 'date'],
    [undefined, 'date'],
  ].forEach(value => {
    expect(getIdKeyForGroupBy(value[0])).toEqual(value[1]);
  });
});

describe('getComputedReportItems', () => {
  test('undefined report returns an empty chart data', () => {
    expect(
      getComputedAwsReportItems({ report: undefined, idKey: 'instance_type' })
    ).toEqual([]);
  });

  test('convert report items into chart format', () => {
    const report = {
      data: [
        {
          date: '2018-09-04',
          instance_types: [
            {
              instance_type: 't1.micro',
              values: [
                {
                  count: { value: 10, units: 'instances' },
                  date: '2018-09-04',
                  instance_type: 't1.micro',
                  usage: { value: 12, units: 'Hrs' },
                },
              ],
            },
            {
              instance_type: 't2.micro',
              values: [
                {
                  count: { value: 0, units: 'instances' },
                  date: '2018-09-04',
                  instance_type: 't2.micro',
                  usage: { value: 48, units: 'Hrs' },
                },
              ],
            },
          ],
        },
        {
          date: '2018-09-05',
          instance_types: [
            {
              instance_type: 't2.micro',
              values: [
                {
                  count: { value: 0, units: 'instances' },
                  date: '2018-09-05',
                  instance_type: 't2.micro',
                  usage: { value: 48, units: 'Hrs' },
                },
              ],
            },
            {
              instance_type: 't2.small',
              values: [
                {
                  count: { value: 0, units: 'instances' },
                  date: '2018-09-05',
                  instance_type: 't2.small',
                  usage: { value: 30, units: 'Hrs' },
                },
              ],
            },
          ],
        },
      ],
    };
    const expected = [
      {
        id: 't2.micro',
        label: 't2.micro',
        total: 96,
        units: 'Hrs',
      },
      {
        id: 't2.small',
        label: 't2.small',
        total: 30,
        units: 'Hrs',
      },
      {
        id: 't1.micro',
        label: 't1.micro',
        total: 12,
        units: 'Hrs',
      },
    ];
    expect(
      getComputedAwsReportItems({ report, idKey: 'instance_type' })
    ).toEqual(expected);
  });

  test('set label to alias if given when label key is account', () => {
    const report = {
      data: [
        {
          date: '2018-09-04',
          accounts: [
            {
              account: '1',
              values: [
                {
                  count: { value: 10, units: 'instances' },
                  date: '2018-09-04',
                  account: '1',
                  account_alias: 'alias',
                  usage: { value: 12, units: 'Hrs' },
                },
              ],
            },
            {
              account: '2',
              values: [
                {
                  count: { value: 0, units: 'instances' },
                  date: '2018-09-04',
                  account: '2',
                  usage: { value: 48, units: 'Hrs' },
                },
              ],
            },
          ],
        },
      ],
    };
    const expected = [
      {
        id: '2',
        label: '2',
        total: 48,
        units: 'Hrs',
      },
      {
        id: '1',
        label: 'alias',
        total: 12,
        units: 'Hrs',
      },
    ];
    expect(getComputedAwsReportItems({ report, idKey: 'account' })).toEqual(
      expected
    );
  });
});
