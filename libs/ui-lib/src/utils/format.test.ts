import * as format from './format';

describe('formatUnits', () => {
  const formatOptions: format.FormatOptions = {};
  const value = 100.11;

  test('null value returns 0', () => {
    expect(format.formatUnits(null, 'unknownUnit')).toBe('0');
  });
  test('unknown unit returns value fixed to fraction digits', () => {
    const formatted = format.formatUnits(value, 'unknownUnit');
    expect(formatted).toMatchSnapshot();
  });

  test('USD unit formats via formatCurrency behavior', () => {
    const units = 'USD';
    const direct = format.formatCurrency(value, units, formatOptions);
    const viaUnits = format.formatUnits(value, units, formatOptions);
    expect(String(viaUnits)).toEqual(String(direct));
  });

  test('null unit returns value fixed to fraction digits', () => {
    const units = null;
    const formatted = format.formatUnits(value, units, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    expect(formatted).toMatchSnapshot();
  });
});

describe('formatCurrency', () => {
  const value = 100.11;
  const units = 'USD';

  test('defaults fraction digits', () => {
    const formatted = format.formatCurrency(value, units);
    expect(formatted).toMatchSnapshot();
  });

  test('uses specified fraction digits', () => {
    const formatted = format.formatCurrency(value, units, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    expect(formatted).toMatchSnapshot();
  });

  test('null value returns $0', () => {
    expect(
      format.formatCurrency(null, 'USD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe(0);
  });
});
