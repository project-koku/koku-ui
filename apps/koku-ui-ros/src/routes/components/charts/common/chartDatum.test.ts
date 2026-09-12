import { intl } from 'components/i18n';
import messages from 'locales/messages';

import {
  getDateRangeString,
  getDatumDateRange,
  getMaxMinValues,
  getTooltipContent,
  isFloat,
  isInt,
} from './chartDatum';

describe('chartDatum helpers', () => {
  test('isInt and isFloat detect non-negative integers and floats', () => {
    expect(isInt(3)).toBe(true);
    expect(isInt(-1)).toBe(false);
    expect(isInt(3.5)).toBe(false);
    expect(isFloat(3.5)).toBe(true);
    expect(isFloat(3)).toBe(false);
    expect(isFloat(-1.2)).toBe(false);
  });

  test('getDatumDateRange skips null values', () => {
    const [start, end] = getDatumDateRange([
      { key: '2021-01-01', y: null, x: 1, units: 'USD' },
      { key: '2021-01-02', y: 1, x: 2, units: 'USD' },
      { key: '2021-01-04', y: 2, x: 4, units: 'USD' },
      { key: '2021-01-05', y: null, x: 5, units: 'USD' },
    ]);
    expect(start.toISOString().startsWith('2021-01-02')).toBe(true);
    expect(end.toISOString().startsWith('2021-01-04')).toBe(true);
  });

  test('getDateRangeString handles empty and populated datums', () => {
    expect(getDateRangeString([] as any, messages.chartNoData)).toBeTruthy();
    expect(getDateRangeString([{ key: '2021-01-02', y: 1, x: 1, units: 'USD' }], undefined as any)).toBeTruthy();
    expect(
      getDateRangeString([{ key: '2021-01-02', y: 1, x: 1, units: 'USD' }], messages.recommendedRequest, true)
    ).toBeTruthy();
  });

  test('getMaxMinValues handles y, y0, and boxplot arrays', () => {
    expect(getMaxMinValues([])).toEqual({ max: null, min: null });
    expect(getMaxMinValues([{ y: 2, y0: 1 } as any, { y: 4, y0: 3 } as any])).toEqual({ max: 4, min: 1 });
    expect(getMaxMinValues([{ y: [1, 5, 3] } as any])).toEqual({ max: 5, min: 1 });
    expect(getMaxMinValues([{ y: [null], yVal: 7 } as any])).toEqual({ max: 7, min: 7 });
    expect(getMaxMinValues([{ y: [null], yVal: null } as any])).toEqual({ max: null, min: null });
    expect(getMaxMinValues([{ y: 3 } as any])).toEqual({ max: 3, min: 3 });
  });

  test('getTooltipContent uses units lookup and falls back to currency', () => {
    const formatter = jest.fn((value: number) => `${value}`);
    const labelFormatter = getTooltipContent(formatter);
    expect(labelFormatter(10, 'cores')).toBeTruthy();
    expect(intl.formatMessage).toHaveBeenCalled();
    expect(labelFormatter(10)).toBeTruthy();
  });
});
