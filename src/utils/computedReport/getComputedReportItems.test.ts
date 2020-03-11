import { getComputedReportItems } from './getComputedReportItems';

describe('getComputedReportItems', () => {
  test('undefined report returns an empty chart data', () => {
    expect(
      getComputedReportItems({
        report: undefined,
        idKey: 'instance_type' as any,
      })
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
    } as any;
    const expected = [
      {
        cost: 96,
        derivedCost: 0,
        id: 't2.micro',
        infrastructureCost: 0,
        label: 't2.micro',
        units: 'Hrs',
      },
      {
        cost: 30,
        derivedCost: 0,
        id: 't2.small',
        infrastructureCost: 0,
        label: 't2.small',
        units: 'Hrs',
      },
      {
        cost: 12,
        derivedCost: 0,
        id: 't1.micro',
        infrastructureCost: 0,
        label: 't1.micro',
        units: 'Hrs',
      },
    ];
    expect(
      getComputedReportItems({ report, idKey: 'instance_type' as any })
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
                  account: '1',
                  account_alias: 'alias',
                  count: { value: 10, units: 'instances' },
                  date: '2018-09-04',
                  derivedCost: 0,
                  infrastructureCost: 0,
                  usage: { value: 12, units: 'Hrs' },
                },
              ],
            },
            {
              account: '2',
              values: [
                {
                  account: '2',
                  count: { value: 0, units: 'instances' },
                  date: '2018-09-04',
                  derivedCost: 0,
                  infrastructureCost: 0,
                  usage: { value: 48, units: 'Hrs' },
                },
              ],
            },
          ],
        },
      ],
    } as any;
    const expected = [
      {
        cost: 48,
        derivedCost: 0,
        id: '2',
        infrastructureCost: 0,
        label: '2',
        units: 'Hrs',
      },
      {
        cost: 12,
        derivedCost: 0,
        id: '1',
        infrastructureCost: 0,
        label: 'alias',
        units: 'Hrs',
      },
    ];
    expect(getComputedReportItems({ report, idKey: 'account' as any })).toEqual(
      expected
    );
  });
});
