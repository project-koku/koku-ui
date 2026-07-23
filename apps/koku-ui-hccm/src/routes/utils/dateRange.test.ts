import { DateRangeType, getDateRange, getDateRangeById, getDateRangeFromQuery } from './dateRange';

describe('dateRange utils', () => {
  test('getDateRangeById maps ids to DateRangeType values', () => {
    expect(getDateRangeById('current_month_to_date')).toBe(DateRangeType.currentMonthToDate);
    expect(getDateRangeById('previous_month')).toBe(DateRangeType.previousMonth);
    expect(getDateRangeById('last_two_months')).toBe(DateRangeType.lastTwoMonths);
    expect(getDateRangeById('last_three_months')).toBe(DateRangeType.lastThreeMonths);
    expect(getDateRangeById('last_six_months')).toBe(DateRangeType.lastSixMonths);
    expect(getDateRangeById('last_twelve_months')).toBe(DateRangeType.lastTwelveMonths);
    expect(getDateRangeById('maximum')).toBe(DateRangeType.maximum);
    expect(getDateRangeById('custom')).toBe(DateRangeType.custom);
  });

  test('getDateRange returns start/end for multi-month presets', () => {
    const lastTwo = getDateRange(DateRangeType.lastTwoMonths, 3, false);
    const lastThree = getDateRange(DateRangeType.lastThreeMonths, 3, false);
    const lastSix = getDateRange(DateRangeType.lastSixMonths, 6, false);
    const lastTwelve = getDateRange(DateRangeType.lastTwelveMonths, 12, false);

    expect(lastTwo.start_date).toBeInstanceOf(Date);
    expect(lastTwo.end_date).toBeInstanceOf(Date);
    expect(lastThree.start_date.getTime()).toBeLessThan(lastTwo.start_date.getTime());
    expect(lastSix.start_date.getTime()).toBeLessThan(lastThree.start_date.getTime());
    expect(lastTwelve.start_date.getTime()).toBeLessThan(lastSix.start_date.getTime());
  });

  test('getDateRange maximum uses data retention months', () => {
    const maxThree = getDateRange(DateRangeType.maximum, 3, false);
    const maxTwelve = getDateRange(DateRangeType.maximum, 12, false);

    expect(maxTwelve.start_date.getTime()).toBeLessThan(maxThree.start_date.getTime());
  });

  test('getDateRangeFromQuery uses custom dates when dateRangeType is custom', () => {
    const result = getDateRangeFromQuery(
      {
        dateRangeType: DateRangeType.custom,
        start_date: '2026-01-01',
        end_date: '2026-01-31',
      } as any,
      6
    );

    expect(result).toEqual({
      dateRangeType: DateRangeType.custom,
      start_date: '2026-01-01',
      end_date: '2026-01-31',
    });
  });

  test('getDateRangeFromQuery defaults to previous month when requested', () => {
    const result = getDateRangeFromQuery({} as any, 3, true);
    expect(result.dateRangeType).toBe(DateRangeType.previousMonth);
    expect(result.start_date).toBeDefined();
    expect(result.end_date).toBeDefined();
  });
});
