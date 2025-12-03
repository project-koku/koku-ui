import { DatumType, createReportDatum, fillChartDatums, getCostRangeString, getCostRangeTooltip, getDateRange, getDatumDateRange, getMaxMinValues, getMaxValue, getTooltipContent, getUsageRangeString, getUsageRangeTooltip, isFloat, isInt, padChartDatums, transformReport } from './chartDatum';

jest.mock('@koku-ui/i18n/i18n', () => ({ __esModule: true, intl: {
	formatMessage: (_m: any, v?: any) => v?.dateRange || v?.month || 'no-data',
	formatNumber: (value: number, _opts?: any) => value.toString(),
	formatDate: (d: Date, _opts?: any) => d.toDateString(),
	formatDateTimeRange: (s: Date, e: Date, _opts?: any) => `${s.toDateString()}-${e.toDateString()}`,
} }));

// Minimal computed items mock: transformReport depends on getComputedReportItems. Mock to echo report.data with id,label and cost
jest.mock('routes/utils/computedReport/getComputedReportItems', () => ({ __esModule: true, getComputedReportItems: (args: any) => {
	const rep = args.report as any;
	return (rep?.data || []).map((d: any) => ({ id: d.id, label: d.label, cost: d.cost }));
} }));

describe('chartDatum helpers', () => {
	test('isInt and isFloat detect non-negative integers and floats', () => {
		expect(isInt(3)).toBe(true);
		expect(isInt(-1)).toBe(false);
		expect(isFloat(3.5)).toBe(true);
		expect(isFloat(3)).toBe(false);
	});

	test('createReportDatum maps x/y/name/units correctly', () => {
		const d = createReportDatum(2.345, { id: '2021-01-02', label: 'L', cost: { total: { value: 1, units: 'USD' } } } as any, 'date', 'cost', 'total');
		expect(d.x).toBe(2);
		expect(d.y).toBe(2.35);
		expect(d.name).toBe('L');
		expect(d.units).toBe('USD');
	});

	test('getMaxValue and getMaxMinValues compute expected values', () => {
		const data = [{ y: 1 }, { y: 5 }, { y: 3 }];
		expect(getMaxValue(data as any)).toBe(5);
		// min is min of y and y0; here min is 1
		expect(getMaxMinValues([{ y: 2, y0: 1 }, { y: 4, y0: 3 }] as any)).toEqual({ max: 4, min: 1 });
	});

	test('padChartDatums and fillChartDatums pad missing dates and fill cumulative vs rolling', () => {
		const start = '2021-01-01'; const end = '2021-01-03';
		const data = [{ key: start, x: 1, y: 1 }, { key: end, x: 3, y: 3 }];
		const padded = padChartDatums(data as any, DatumType.cumulative);
		expect(padded.length).toBeGreaterThanOrEqual(3);
		const filled = fillChartDatums([{ key: start, x: 1, y: 1 }] as any, DatumType.rolling);
		// first existing value remains, later missing days become null in rolling mode
		expect(filled[0].y).toBe(1);
	});

	test('getDatumDateRange and getDateRange compute ranges with offset and boundaries', () => {
		const data = [{ key: '2021-01-02', y: 1 }, { key: '2021-01-04', y: 2 }];
		const [s1, e1] = getDatumDateRange(data as any);
		expect(s1.toISOString().startsWith('2021-01-02')).toBe(true);
		expect(e1.toISOString().startsWith('2021-01-04')).toBe(true);
		const [s2, e2] = getDateRange(data as any, true, true, 0);
		expect(s2.getDate()).toBe(1);
		expect(e2.getDate()).toBeGreaterThan(1);
	});

	test('getTooltipContent uses units lookup and falls back to formatCurrency', () => {
		const f = getTooltipContent((v: number) => `${v}`);
		expect(f(10, 'USD', {} as any)).toContain('10');
	});

	test('getCostRangeString and getCostRangeTooltip handle empty and populated datums', () => {
		expect(getCostRangeString([] as any)).toBe('no-data');
		expect(getUsageRangeString([] as any)).toBe('no-data');
		const data = [{ key: '2021-01-02', y: 1 }];
		expect(getCostRangeTooltip(data as any)).toContain('Jan');
		expect(getUsageRangeTooltip(data as any)).toContain('Jan');
	});

	test('transformReport returns padded series for cumulative and rolling', () => {
		const report = { data: [{ id: '2021-01-01', label: 'A', cost: { total: { value: 1, units: 'USD' } } }, { id: '2021-01-02', label: 'B', cost: { total: { value: 2, units: 'USD' } } }] } as any;
		const cum = transformReport(report, DatumType.cumulative, 'date', 'cost', 'total');
		expect(cum.length).toBeGreaterThanOrEqual(2);
		const roll = transformReport(report, DatumType.rolling, 'date', 'cost', 'total');
		expect(roll.length).toBeGreaterThanOrEqual(2);
	});
}); 