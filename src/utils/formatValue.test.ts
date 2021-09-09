import * as format from './formatValue';

jest.spyOn(format, 'formatCurrency');

describe('formatValue', () => {
  const formatOptions: format.FormatOptions = {};
  const value = 100.11;

  test('null value returns 0', () => {
    expect(format.formatValue(null, 'unknownUnit')).toBe('0');
  });
  test('unknown unit returns value fixed to fractionDigits', () => {
    const formatted = format.formatValue(value, 'unknownUnit');
    expect(formatted).toMatchSnapshot();
  });

  test('USD unit calls formatCurrency', () => {
    const units = 'USD';
    format.formatCurrency(value, units, formatOptions);
    expect(format.formatCurrency).toBeCalledWith(value, units, formatOptions);
  });

  test('null unit returns value fixed to fractionDigits', () => {
    const units = null;
    const formatted = format.formatValue(value, units, { fractionDigits: 1 });
    expect(formatted).toMatchSnapshot();
  });
});

describe('formatCurrency', () => {
  const value = 100.11;
  const units = 'USD';

  test('defaults fractionDigits', () => {
    const formatted = format.formatCurrency(value, units);
    expect(formatted).toMatchSnapshot();
  });

  test('uses specified fractionDigits', () => {
    const formatted = format.formatCurrency(value, units, {
      fractionDigits: 0,
    });
    expect(formatted).toMatchSnapshot();
  });

  test('null value returns $0', () => {
    expect(format.formatCurrency(null, 'USD', { fractionDigits: 0 })).toBe(0);
  });
});
