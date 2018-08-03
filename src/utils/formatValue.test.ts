import * as format from './formatValue';

jest.spyOn(format, 'formatCurrency');

describe('formatValue', () => {
  const formatOptions: format.FormatOptions = {};
  const value = 100.11;

  test('defaults to returning the value', () => {
    const formatted = format.formatValue(value, 'unknownUnit');
    expect(formatted).toBe(value);
  });

  test('usd unit calls formatCurrency', () => {
    const unit = 'usd';
    format.formatValue(value, unit, formatOptions);
    expect(format.formatCurrency).toBeCalledWith(value, unit, formatOptions);
  });
});

describe('formatCurrency', () => {
  const value = 100.11;
  const unit = 'USD';

  test('defaults fractionDigits', () => {
    const formattedValue = format.formatCurrency(value, unit);
    expect(formattedValue).toMatchSnapshot();
  });

  test('uses specified fractionDigits', () => {
    const formattedValue = format.formatCurrency(value, unit, {
      fractionDigits: 0,
    });
    expect(formattedValue).toMatchSnapshot();
  });
});
