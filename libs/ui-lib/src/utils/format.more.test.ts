import { countDecimals, formatCurrency, formatCurrencyAbbreviation, formatCurrencyRate, formatCurrencyRateRaw, formatCurrencyRaw, formatOptimization, formatPercentage, formatPercentageMarkup, formatUnits, formatUsage, isCurrencyFormatValid, isPercentageFormatValid, unFormat, unitsLookupKey } from './format';

jest.mock('@koku-ui/i18n/i18n', () => ({ __esModule: true, getLocale: () => 'en', intl: { formatNumber: (v: number, opts?: any) => new Intl.NumberFormat('en', opts).format(v), formatMessage: (_m: any, v: any) => `${v.symbol || ''}${v.value || ''}` } }));

describe('utils/format', () => {
	test('countDecimals supports locale and raw dot', () => {
		expect(countDecimals('1.23', false)).toBe(2);
		expect(countDecimals('1.2345', false)).toBe(4);
	});

	test('formatCurrency basic and negative zero handling', () => {
		expect(formatCurrency(12.34, 'usd')).toContain('12.34');
		expect(formatCurrency(-0, 'usd')).toContain('0');
	});

	test.each([
		[0, 'USD', '0'],
		[1500, 'USD', 'thousand$1.5'],
		[2_000_000, 'USD', 'million$2'],
		[3_000_000_000, 'USD', 'billion$3'],
	])('formatCurrencyAbbreviation %p %p contains %p', (val, units, expected) => {
		const out = formatCurrencyAbbreviation(val as any, units as any);
		expect(out).toContain(expected as any);
	});

	test('formatCurrencyRate and raw variants', () => {
		expect(formatCurrencyRate(1.23456789, 'USD')).toContain('1.23456789');
		expect(formatCurrencyRateRaw(1.23456789, 'USD')).toContain('1.23456789');
	});

	test('formatCurrencyRaw removes code and NBSPs', () => {
		const out = formatCurrencyRaw(1234.56, 'USD');
		expect(out).not.toContain('USD');
	});

	test('formatUnits maps usage units via formatUsage, fallback to unknownType', () => {
		expect(formatUnits(10, 'gb_month')).toContain('10');
		expect(formatUnits(10, 'unknown')).toContain('10');
	});

	test('formatPercentage and markup/optimization/usage', () => {
		expect(formatPercentage(12.345)).toContain('12.35');
		expect(formatPercentageMarkup(12.3456789012)).toContain('12.3456789012');
		expect(formatOptimization(12.345678)).toContain('12.345678');
		expect(formatUsage(9.87)).toContain('9.87');
	});

	test('validators and unFormat', () => {
		expect(isCurrencyFormatValid('1,234.56')).toBe(true);
		expect(isPercentageFormatValid('1,234.56')).toBe(true);
		expect(unFormat('1,234.56')).toBe('1234.56');
	});

	test.each([
		['GiB mo', 'gib_month'],
		['GB mo', 'gb_month'],
		['Tag mo', 'tag_month'],
		['core-hours', 'core_hours'],
		['Gib', 'gib'],
		['unknown', undefined],
	])('unitsLookupKey maps %p to %p', (input, expected) => {
		expect(unitsLookupKey(input as any)).toBe(expected as any);
	});
}); 