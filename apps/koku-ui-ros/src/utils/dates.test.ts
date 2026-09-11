import {
  formatDate,
  formatStartEndDate,
  getCurrentMonthDate,
  getForDateRangeString,
  getLast30DaysDate,
  getLast60DaysDate,
  getLast90DaysDate,
  getLastDaysDate,
  getMonthDate,
  getNoDataForDateRangeString,
  getSinceDateRangeString,
  getTimeFromNow,
  getToday,
  getTotalCostDateRangeString,
} from './dates';

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: {
    formatDateTimeRange: (start: Date, end: Date) =>
      `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()} to ${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
    formatMessage: (_msg: unknown, values: { dateRange?: string; value?: string | number }) =>
      JSON.stringify(values),
    formatRelativeTime: (value: number, unit: string) => `${value} ${unit}`,
  },
}));

describe('utils/dates', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-05-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('formatDate and formatStartEndDate', () => {
    const date = new Date(2024, 0, 2);
    expect(formatDate(date)).toBe('2024-01-02');
    expect(formatDate(date, false)).toBe(date);
    expect(formatDate(undefined)).toBeUndefined();

    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 31);
    expect(formatStartEndDate(start, end)).toEqual({
      start_date: '2024-01-01',
      end_date: '2024-01-31',
    });
  });

  test('getToday applies time components', () => {
    const today = getToday(1, 2, 3, 4);
    expect(today.getHours()).toBe(1);
    expect(today.getMinutes()).toBe(2);
    expect(today.getSeconds()).toBe(3);
    expect(today.getMilliseconds()).toBe(4);
  });

  test('date range message helpers', () => {
    expect(JSON.parse(getNoDataForDateRangeString())).toHaveProperty('dateRange');
    expect(JSON.parse(getNoDataForDateRangeString(undefined, 0))).toHaveProperty('dateRange');
    expect(JSON.parse(getForDateRangeString(5))).toMatchObject({ value: 5 });
    expect(JSON.parse(getForDateRangeString(5, undefined, 0))).toMatchObject({ value: 5 });
    expect(JSON.parse(getSinceDateRangeString())).toHaveProperty('dateRange');
    expect(JSON.parse(getTotalCostDateRangeString(10))).toMatchObject({ value: 10 });
  });

  test('getMonthDate and getCurrentMonthDate', () => {
    const current = getCurrentMonthDate();
    expect(current.start_date).toMatch(/\d{4}-\d{2}-01/);
    const previous = getMonthDate(1);
    expect(previous.start_date).toMatch(/\d{4}-\d{2}-01/);
    expect(getMonthDate(0, false).start_date).toBeInstanceOf(Date);
  });

  test('last X days helpers', () => {
    const lastSeven = getLastDaysDate(7);
    expect(lastSeven.start_date <= lastSeven.end_date).toBe(true);
    expect(getLast30DaysDate().start_date <= getLast30DaysDate().end_date).toBe(true);
    expect(getLast60DaysDate().start_date <= getLast60DaysDate().end_date).toBe(true);
    expect(getLast90DaysDate().start_date <= getLast90DaysDate().end_date).toBe(true);
  });

  test('getTimeFromNow formats relative units', () => {
    expect(getTimeFromNow(undefined as unknown as string)).toMatch(/second/);
    expect(getTimeFromNow('2024-05-13T12:00:00Z')).toBe('-2 day');
    expect(getTimeFromNow('2024-05-01T12:00:00Z')).toMatch(/week/);
    expect(getTimeFromNow('2024-05-15T09:00:00Z')).toBe('-3 hour');
    expect(getTimeFromNow('2024-05-15T11:50:00Z')).toBe('-10 minute');
    expect(getTimeFromNow('2024-05-15T11:59:30Z')).toBe('-30 second');
  });
});
