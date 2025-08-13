import * as i18n from 'components/i18n';

// Top-level intl mock
const formatDateTimeRange = jest.fn(() => 'Jan 1 – Jan 31');
const formatMessage = jest.fn((_msg, values) => `${values?.value ?? ''} ${values?.dateRange ?? ''}`.trim());
const formatRelativeTime = jest.fn((_value, unit) => `in ${unit}`);

jest.mock('components/i18n', () => ({
  __esModule: true,
  ...jest.requireActual('components/i18n'),
  intl: {
    formatDateTimeRange: (...args: unknown[]) => formatDateTimeRange(...(args as any)),
    formatMessage: (...args: unknown[]) => formatMessage(...(args as any)),
    formatRelativeTime: (...args: unknown[]) => formatRelativeTime(...(args as any)),
  },
}));

describe('utils/dates', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('getNoDataForDateRangeString formats message', () => {
    const { getNoDataForDateRangeString } = require('./dates');
    const text = getNoDataForDateRangeString(undefined, 1, true);
    expect(formatDateTimeRange).toHaveBeenCalled();
    expect(typeof text).toBe('string');
  });

  test('getForDateRangeString includes value', () => {
    const { getForDateRangeString } = require('./dates');
    const text = getForDateRangeString('X', undefined, 0, false);
    expect(formatDateTimeRange).toHaveBeenCalled();
    expect(text).toContain('X');
  });

  test('getSinceDateRangeString formats message', () => {
    const { getSinceDateRangeString } = require('./dates');
    const text = getSinceDateRangeString(undefined, 0, false);
    expect(formatDateTimeRange).toHaveBeenCalled();
    expect(typeof text).toBe('string');
  });

  test('getTotalCostDateRangeString includes value', () => {
    const { getTotalCostDateRangeString } = require('./dates');
    const text = getTotalCostDateRangeString(123, undefined, 2, true);
    expect(formatDateTimeRange).toHaveBeenCalled();
    expect(text).toContain('123');
  });

  test('getLastDaysDate returns range for offset', () => {
    const { getLastDaysDate, formatStartEndDate } = require('./dates');
    const res = getLastDaysDate(7, true);
    expect(res.start_date <= res.end_date).toBeTruthy();
  });

  test('getTimeFromNow uses relative units', () => {
    const { getTimeFromNow } = require('./dates');
    const res = getTimeFromNow(new Date().toISOString());
    expect(formatRelativeTime).toHaveBeenCalled();
    expect(typeof res).toBe('string');
  });
}); 