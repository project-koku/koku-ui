import * as format from './format';

jest.mock('components/i18n', () => ({
  __esModule: true,
  getLocale: () => 'en',
  intl: {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat('en', options).format(value),
    formatMessage: (_msg: unknown, values: { symbol?: string; value?: string }) =>
      `${values.symbol || ''}${values.value || ''}`,
  },
}));

describe('utils/format additional coverage', () => {
  test('countDecimals supports locale and raw dot', () => {
    expect(format.countDecimals('1.23', false)).toBe(2);
    expect(format.countDecimals('123', false)).toBe(0);
    expect(format.countDecimals('1.23')).toBeGreaterThanOrEqual(0);
  });

  test('formatCurrency handles negative zero and missing units', () => {
    expect(format.formatCurrency(-0.001, 'usd')).toContain('0');
    expect(format.formatCurrency(12.34, '')).toContain('12.34');
  });

  test.each([
    [0, 'USD'],
    [1500, 'USD'],
    [2_000_000, 'USD'],
    [3_000_000_000, 'USD'],
    [4_000_000_000_000, 'USD'],
  ])('formatCurrencyAbbreviation formats %p', value => {
    const output = format.formatCurrencyAbbreviation(value as number, 'USD');
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
  });

  test('formatCurrencyRate and raw variants', () => {
    expect(format.formatCurrencyRate(1.23456789, 'USD')).toContain('1.23456789');
    expect(format.formatCurrencyRateRaw(1.23456789, 'USD')).not.toContain('USD');
    expect(format.formatCurrencyRaw(1234.56, 'USD')).not.toContain('USD');
  });

  test('formatUnits maps known lookup keys and falls back', () => {
    expect(format.formatUnits(10, 'bytes')).toContain('10');
    expect(format.formatUnits(10, 'g')).toContain('10');
    expect(format.formatUnits(null as any, 'unknown')).toBe('0');
    expect(format.formatUnits(10, 'unknown')).toContain('10');
  });

  test('percentage, markup, optimization, and usage formatters', () => {
    expect(format.formatPercentage(12.345)).toContain('12.35');
    expect(format.formatPercentageMarkup(12.3456789012)).toContain('12.3456789012');
    expect(format.formatOptimization(12.345678)).toContain('12.345678');
    expect(format.formatUsage(9.87)).toContain('9.87');
  });

  test('validators and unFormat', () => {
    expect(format.isCurrencyFormatValid('1,234.56')).toBe(true);
    expect(format.isCurrencyFormatValid('abc')).toBe(false);
    expect(format.isPercentageFormatValid('12.34')).toBe(true);
    expect(format.unFormat('')).toBe('');
    expect(format.unFormat('1,234.56')).toBe('1234.56');
  });

  test.each([
    ['bytes', 'bytes'],
    ['GiB', 'gib'],
    ['millicores', 'millicores'],
    ['unknown', undefined],
    [undefined, undefined],
  ])('unitsLookupKey maps %p to %p', (input, expected) => {
    expect(format.unitsLookupKey(input as any)).toBe(expected);
  });
});
