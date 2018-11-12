import * as format from './formatValue';

jest.spyOn(format, 'formatCurrency');
jest.spyOn(format, 'unknownTypeFormatter');

describe('formatValue', () => {
  const formatOptions: format.FormatOptions = {};
  const value = 100.11;

  test('unknown unit returns value fixed to fractionDigits', () => {
    const formatted = format.formatValue(value, 'unknownUnit');
    expect(formatted).toMatchSnapshot();
  });

  test('undefined value set value to 0', () => {
    const formatted = format.formatValue(undefined, 'unknownUnit');
    expect(formatted).toBe('0');
  });

  test('usd unit calls formatCurrency', () => {
    const unit = 'usd';
    format.formatValue(value, unit, formatOptions);
    expect(format.formatCurrency).toBeCalledWith(value, unit, formatOptions);
  });

  test('gb unit calls unknownTypeFormatter', () => {
    const unit = 'gb-mo';
    format.formatValue(value, unit, formatOptions);
    expect(format.unknownTypeFormatter).toBeCalledWith(value, 'gb', {
      fractionDigits: 2,
    });
  });

  test('hrs unit calls unknownTypeFormatter', () => {
    const unit = 'hrs';
    format.formatValue(value, unit, formatOptions);
    expect(format.unknownTypeFormatter).toBeCalledWith(value, unit, {
      fractionDigits: 2,
    });
  });

  test('null unit returns value fixed to fractionDigits', () => {
    const unit = null;
    const formatted = format.formatValue(value, unit, { fractionDigits: 1 });
    expect(formatted).toMatchSnapshot();
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

describe('unknownTypeFormatter', () => {
  test('default formatOptions', () => {
    const formatted = format.unknownTypeFormatter(10.421, 'Hours');
    expect(formatted).toBe('10 Hours');
  });

  test('custom formatOptions', () => {
    const options = {
      fractionDigits: 2,
      translateFunction: (text: string) => `-${text}-`,
    };
    const formatted = format.unknownTypeFormatter(10.421, 'Hours', options);
    expect(formatted).toBe('10.42 -Hours-');
  });
});
