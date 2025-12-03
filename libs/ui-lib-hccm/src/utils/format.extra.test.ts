import * as f from './format';

describe('utils/format (additional)', () => {
  test.each([
    { value: 1234567, units: 'USD' },
    { value: 1234, units: 'USD' },
  ])('formatCurrencyAbbreviation %#', ({ value, units }) => {
    const out = f.formatCurrencyAbbreviation(value, units);
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });

  test.each([
    { value: '1,234.56', expected: true },
    { value: '1,234', expected: true },
    { value: 'abc', expected: false },
  ])('isCurrencyFormatValid %#', ({ value, expected }) => {
    expect(f.isCurrencyFormatValid(value)).toBe(expected);
  });

  test.each([
    { value: '12.34', expected: true },
    { value: '100', expected: true },
    { value: 'abc', expected: false },
  ])('isPercentageFormatValid %#', ({ value, expected }) => {
    expect(f.isPercentageFormatValid(value)).toBe(expected);
  });

  test.each([
    { value: '1,234.56', expected: '1234.56' },
    { value: '$1,234.56', expected: '$1234.56' },
  ])('unFormat %#', ({ value, expected }) => {
    const out = f.unFormat(value);
    expect(out).toBe(expected);
  });

  test.each([
    { units: 'USD', expected: undefined },
    { units: 'GB', expected: 'gb' },
    { units: 'requests', expected: undefined },
    { units: 'GB-mo', expected: 'gb_month' },
  ])('unitsLookupKey %#', ({ units, expected }) => {
    const key = f.unitsLookupKey(units);
    expect(key).toBe(expected);
  });

  test.each([
    { v: 0.1234 },
    { v: 1.234 },
  ])('formatPercentage variants %#', ({ v }) => {
    const out = f.formatPercentage(v as any, {} as any);
    expect(typeof out).toBe('string');
  });
}); 