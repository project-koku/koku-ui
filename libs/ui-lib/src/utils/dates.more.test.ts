import { getToday, formatDate, formatStartEndDate, getNoDataForDateRangeString, getForDateRangeString, getSinceDateRangeString, getTotalCostDateRangeString, getMonthDate, getCurrentMonthDate, getLastDaysDate, getLast30DaysDate, getLast60DaysDate, getLast90DaysDate, getTimeFromNow } from './dates';

jest.mock('@koku-ui/i18n/i18n/intl', () => ({ __esModule: true, default: { formatDateTimeRange: (s: Date, e: Date) => `${s.getFullYear()}-${s.getMonth()+1}-${s.getDate()} to ${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`, formatMessage: (_m: any, v: any) => JSON.stringify(v), formatRelativeTime: (v: number, unit: string) => `${v} ${unit}` } }));

describe('utils/dates', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-05-15T12:00:00Z'));
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	test('formatDate and formatStartEndDate', () => {
		const d = new Date(2024, 0, 2);
		expect(formatDate(d)).toBe('2024-01-02');
		expect(formatDate(d, false)).toBe(d);
		const s = new Date(2024, 0, 1);
		const e = new Date(2024, 0, 31);
		expect(formatStartEndDate(s, e)).toEqual({ start_date: '2024-01-01', end_date: '2024-01-31' });
	});

	test.each([
		['noData', getNoDataForDateRangeString],
		['forDate', (v: any) => getForDateRangeString(5)],
		['sinceDate', getSinceDateRangeString],
		['totalCost', (v: any) => getTotalCostDateRangeString(10)],
	])('%s date range with and without offset, end-of-month', (_name, fn: any) => {
		// default offset 0
		expect(fn()).toMatch(/to/);
		// offset 1 normal end
		expect(fn(0, 1)).toMatch(/to/);
		// offset 1 end-of-month
		expect(fn(0, 1, true)).toMatch(/to/);
	});

	test('getMonthDate and getCurrentMonthDate', () => {
		const cur = getCurrentMonthDate();
		expect(cur.start_date).toMatch(/\d{4}-\d{2}-01/);
		const prev = getMonthDate(1);
		expect(prev.start_date).toMatch(/\d{4}-\d{2}-01/);
	});

	test('last X days helpers', () => {
		const d30 = getLast30DaysDate();
		const d60 = getLast60DaysDate();
		const d90 = getLast90DaysDate();
		expect(d30.start_date <= d30.end_date).toBe(true);
		expect(d60.start_date <= d60.end_date).toBe(true);
		expect(d90.start_date <= d90.end_date).toBe(true);
	});

	test('getTimeFromNow formats relative units', () => {
		// 2 days ago
		expect(getTimeFromNow('2024-05-13T12:00:00Z')).toBe('-2 day');
		// 3 hours ago
		expect(getTimeFromNow('2024-05-15T09:00:00Z')).toBe('-3 hour');
		// 10 minutes ago
		expect(getTimeFromNow('2024-05-15T11:50:00Z')).toBe('-10 minute');
		// 30 seconds ago
		expect(getTimeFromNow('2024-05-15T11:59:30Z')).toBe('-30 second');
	});
}); 