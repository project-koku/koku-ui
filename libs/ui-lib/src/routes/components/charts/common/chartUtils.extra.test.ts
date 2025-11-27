import { getInteractiveLegendItemStyles } from '@patternfly/react-charts/victory';
import { getChartNames, getDomain, getLegendData, getResizeObserver, getTooltipLabel, initHiddenSeries, isDataAvailable, isDataHidden, isSeriesHidden } from './chartUtils';

jest.mock('@patternfly/react-charts/victory', () => ({ __esModule: true, getInteractiveLegendItemStyles: jest.fn((hidden: boolean) => ({ hidden })) }));

// Minimal intl hookup so getTooltipLabel can format fallback strings via messages
jest.mock('@koku-ui/i18n/i18n/intl', () => ({ __esModule: true, default: {
	formatMessage: (_msg: any, vars?: any) => (vars?.value0 ? `${vars.value0}-${vars.value1}` : vars?.month || vars?.dateRange || 'no-data'),
	formatNumber: (value: number, _opts?: any) => value.toString(),
	formatDate: (d: Date, _opts?: any) => d.toDateString(),
	formatDateTimeRange: (s: Date, e: Date, _opts?: any) => `${s.toDateString()}-${e.toDateString()}`,
} }));

// formatter used by getTooltipLabel
const formatter = (value: number) => `${value}`;

const mkSeries = (values: Array<{ y?: number; y0?: number; units?: string }>, childName?: string) => ({
	childName,
	data: values.map(v => ({ ...v, childName })),
	legendItem: { name: 'n', tooltip: 't' },
});

describe('chartUtils', () => {
	test('getChartNames returns childName groups', () => {
		const names = getChartNames([{ childName: 'a' } as any, { childName: 'b' } as any]);
		expect(names).toEqual(['a', 'b']);
	});

	test.each([
		{ values: [ { y: 1 }, { y: 3 }, { y: 2 } ], hidden: new Set<number>(), expectY: [0, 4] },
		{ values: [ { y: 0 } ], hidden: new Set<number>([0]), expectY: undefined },
		{ values: [], hidden: new Set<number>(), expectY: undefined },
	])('getDomain computes y domain appropriately %#', ({ values, hidden, expectY }) => {
		const d = getDomain([mkSeries(values)], hidden as any);
		if (expectY) {
			expect(d.y).toBeDefined();
			expect((d.y as any)[0]).toBe(0);
			expect((d.y as any)[1]).toBeGreaterThan(0);
		} else {
			expect(d.y).toBeUndefined();
		}
	});

	test('getLegendData maps legend items and applies hidden styles and tooltip name override', () => {
		const hidden = new Set<number>([1]);
		const series = [mkSeries([{ y: 1 }], 'a'), mkSeries([{ y: 2 }], 'b')];
		const data = getLegendData(series as any, hidden, true);
		expect(getInteractiveLegendItemStyles).toHaveBeenCalledTimes(2);
		expect(data[0]).toEqual(expect.objectContaining({ childName: 'a', hidden: false, name: 't' }));
		expect(data[1]).toEqual(expect.objectContaining({ childName: 'b', hidden: true, name: 't' }));
	});

	test('getTooltipLabel handles y/y0 both present, only y, and no data', () => {
		const formatOptions: any = {};
		expect(getTooltipLabel({ y: 10, y0: 5, units: 'USD' }, formatter as any, formatOptions)).toBe('5-10');
		expect(getTooltipLabel({ y: 10, units: 'USD' }, formatter as any, formatOptions)).toBe('10');
		expect(getTooltipLabel({ y: null, units: 'USD' }, formatter as any, formatOptions)).toBe('no-data');
	});

	test('getResizeObserver uses ResizeObserver if available, else falls back to window resize listener and NAVIGATION_TOGGLE', () => {
		const handleResize = jest.fn();
		const div = document.createElement('div');
		// Case 1: ResizeObserver present
		const unobs = jest.fn();
		class RO { observe = jest.fn(); unobserve = unobs; constructor(_cb: any) {} }
		(window as any).ResizeObserver = RO as any;
		const cleanup1 = getResizeObserver(div, handleResize);
		cleanup1();
		expect(unobs).toHaveBeenCalled();
		// Case 2: no ResizeObserver
		delete (window as any).ResizeObserver;
		const addEv = jest.spyOn(window, 'addEventListener');
		const remEv = jest.spyOn(window, 'removeEventListener');
		(window as any).insights = { chrome: { on: jest.fn(() => jest.fn()) } };
		const cleanup2 = getResizeObserver(div, handleResize);
		expect(addEv).toHaveBeenCalledWith('resize', handleResize);
		cleanup2();
		expect(remEv).toHaveBeenCalledWith('resize', handleResize);
	});

	test('initHiddenSeries toggles a specific index', () => {
		const set = new Set<number>([1]);
		expect(initHiddenSeries([], set as any, 0).has(0)).toBe(true);
		expect(initHiddenSeries([], set as any, 1).has(1)).toBe(false);
	});

	test('isDataAvailable returns false when all series unavailable or hidden', () => {
		expect(isDataAvailable([mkSeries([], 'a'), mkSeries([], 'b')] as any, new Set<number>())).toBe(false);
		expect(isDataAvailable([mkSeries([{ y: 1 }], 'a')] as any, new Set<number>([0]))).toBe(false);
		expect(isDataAvailable([mkSeries([{ y: 1 }], 'a')] as any, new Set<number>())).toBe(true);
	});

	test('isDataHidden returns true when data childName matches hidden series childName', () => {
		const series = [mkSeries([{ y: 1 }], 'a'), mkSeries([{ y: 2 }], 'b')] as any;
		const data = [{ childName: 'b' }];
		expect(isDataHidden(series, new Set<number>([1]) as any, data as any)).toBe(true);
		expect(isDataHidden(series, new Set<number>([0]) as any, data as any)).toBe(false);
	});

	test('isSeriesHidden checks set membership', () => {
		const hidden = new Set<number>([2]);
		expect(isSeriesHidden(hidden as any, 2)).toBe(true);
		expect(isSeriesHidden(hidden as any, 1)).toBe(false);
	});
}); 