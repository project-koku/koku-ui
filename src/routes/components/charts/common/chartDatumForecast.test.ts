import { DatumType } from './chartDatum';
import {
	ComputedForecastItemType,
	createForecastConeDatum,
	createForecastDatum,
	getComputedForecast,
	getNumberOfDays,
	transformForecast,
	transformForecastCone,
} from './chartDatumForecast';

jest.mock('routes/utils/computedForecast/getComputedForecastItems', () => ({
	__esModule: true,
	getComputedForecastItems: (items: any) => {
		const data = items.forecast?.data || [];
		// Map PF forecast payload to minimal computed structure used by transforms
		return data.flatMap((d: any) =>
			d.values?.map((v: any) => ({ date: v.date, cost: v.cost, infrastructure: v.infrastructure, supplementary: v.supplementary })) || []
		);
	},
}));

describe('chartDatumForecast', () => {
	test('createForecastDatum rounds floats, preserves ints, null yields y null', () => {
		const d: any = { date: '2021-01-02', cost: { total: { units: 'USD' } } };
		expect(createForecastDatum(1.234, d)).toMatchObject({ x: 2, y: 1.23, key: '2021-01-02', units: 'USD' });
		expect(createForecastDatum(5, d)).toMatchObject({ y: 5 });
		expect(createForecastDatum(null as any, d)).toMatchObject({ y: null });
	});

	test('createForecastConeDatum sets y/y0 with rounding and handles nulls', () => {
		const d: any = { date: '2021-01-03', cost: { total: { units: 'USD' } } };
		expect(createForecastConeDatum(2.345, 1.111, d)).toMatchObject({ x: 3, y: 2.35, y0: 1.11, key: '2021-01-03' });
		expect(createForecastConeDatum(null as any, null as any, d)).toMatchObject({ y: null, y0: null });
	});

	test('getNumberOfDays computes whole-day differences', () => {
		expect(getNumberOfDays('2021-01-01','2021-01-02')).toBe(1);
		expect(getNumberOfDays('2021-01-02','2021-01-01')).toBe(-1);
	});

	test('getComputedForecast strips overlap and inserts cumulative starting value with units', () => {
		const report: any = {
			data: [
				{ date: '2021-01-01', values: [{ date: '2021-01-01' }] },
				{ date: '2021-01-02', values: [{ date: '2021-01-02' }] },
			],
			meta: { total: { cost: { total: { value: 100, units: 'USD' } } } },
		};
		const forecast: any = {
			data: [
				{ date: '2021-01-02', values: [{ date: '2021-01-02', cost: { total: { value: 101 }, confidence_max: { value: 2 }, confidence_min: { value: 1 } }, infrastructure: { total: { value: 101 }, confidence_max: { value: 2 }, confidence_min: { value: 1 } }, supplementary: { total: { value: 101 }, confidence_max: { value: 2 }, confidence_min: { value: 1 } } }] },
				{ date: '2021-01-03', values: [{ date: '2021-01-03', cost: { total: { value: 105 }, confidence_max: { value: 3 }, confidence_min: { value: 2 } }, infrastructure: { total: { value: 105 }, confidence_max: { value: 3 }, confidence_min: { value: 2 } }, supplementary: { total: { value: 105 }, confidence_max: { value: 3 }, confidence_min: { value: 2 } } }] },
			],
		};
		const gf = getComputedForecast(forecast, report, ComputedForecastItemType.cost, DatumType.cumulative);
		expect(gf.data[0].values[0].cost.total.value).toBe(100);
		expect(gf.data[0].date).toBe('2021-01-02');
		expect(gf.data[1].date).toBe('2021-01-03');
	});

	test('transformForecast handles cumulative vs daily', () => {
		const forecast: any = {
			data: [
				{ date: '2021-01-02', values: [{ date: '2021-01-02', cost: { total: { value: 2, units: 'USD' } } }] },
				{ date: '2021-01-03', values: [{ date: '2021-01-03', cost: { total: { value: 3, units: 'USD' } } }] },
			],
		};
		// Daily
		const daily = transformForecast(forecast, DatumType.rolling);
		// Result padded to full month by padChartDatums; filter non-nulls for core assertion
		expect(daily.map(d => d.y).filter(v => v != null)).toEqual([2,3]);
		const cumulative = transformForecast(forecast, DatumType.cumulative);
		expect(cumulative.map(d => d.y).filter(v => v != null)).toEqual([2,5]);
	});

	test('transformForecastCone handles cumulative vs daily cones', () => {
		const forecast: any = {
			data: [
				{ date: '2021-01-02', values: [{ date: '2021-01-02', cost: { total: { value: 2 }, confidence_max: { value: 1 }, confidence_min: { value: 1 } } }] },
				{ date: '2021-01-03', values: [{ date: '2021-01-03', cost: { total: { value: 3 }, confidence_max: { value: 2 }, confidence_min: { value: 1 } } }] },
			],
		};
		const daily = transformForecastCone(forecast, DatumType.rolling);
		expect(daily.map(d => [d.y, d.y0]).filter(([y]) => y != null)).toEqual([[1,1],[2,1]]);
		const cumulative = transformForecastCone(forecast, DatumType.cumulative);
		expect(cumulative.map(d => [d.y, d.y0]).filter(([y]) => y != null)).toEqual([[3,3],[5,4]]);
	});

	test('transform functions return empty array for null inputs', () => {
		expect(transformForecast(null as any, DatumType.rolling)).toEqual([]);
		expect(transformForecastCone(null as any, DatumType.rolling)).toEqual([]);
	});
}); 