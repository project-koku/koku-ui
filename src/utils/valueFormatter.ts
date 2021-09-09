import { getLocale, intl } from 'components/i18n';
import messages from 'locales/messages';

export interface ValueFormatterOptions {
  fractionDigits?: number;
}

export type ValueFormatter = (value: number, units: string, options?: ValueFormatterOptions) => string | number;
type UnitsFormatter = (value: number, options?: ValueFormatterOptions) => string | number;

// Returns i18n key for given units
export const unitLookupKey = (units): string => {
  const lookup = units ? units.replace(/[- ]/g, '_').toLowerCase() : '';

  switch (lookup) {
    case 'core_hours':
    case 'gb':
    case 'gb_hours':
    case 'gb_mo':
    case 'gibibyte_month':
    case 'hour':
    case 'hrs':
    case 'tag_mo':
    case 'vm_hours':
      return lookup;
    default:
      return undefined;
  }
};

// Returns formatted units or currency with given currency-code
export const formatValue: ValueFormatter = (value, units, options: ValueFormatterOptions = {}) => {
  const lookup = unitLookupKey(units);
  const fValue = value || 0;

  switch (lookup) {
    case 'core_hours':
    case 'hour':
    case 'hrs':
      return formatUsageHrs(fValue, options);
    case 'gb':
    case 'gb_hours':
    case 'gb_mo':
    case 'gibibyte_month':
    case 'tag_mo':
    case 'vm_hours':
      return formatUsageGb(fValue, options);
  }
  return unknownTypeFormatter(fValue);
};

// Some currencies do not have decimals, such as JPY, and some have 3 decimals such as IQD.
// See https://docs.adyen.com/development-resources/currency-codes
export const formatCurrency: ValueFormatter = (value: number, units: string, { fractionDigits } = {}): string => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  const options = {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  };
  return intl.formatNumber(fValue, {
    style: 'currency',
    currency: units ? units.toUpperCase() : 'USD',
    ...(fractionDigits !== undefined && options),
  });
};

export const formatCurrencyAbbreviation: ValueFormatter = (value, units = 'USD') => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }

  // Derived from https://stackoverflow.com/questions/37799955/how-can-i-format-big-numbers-with-tolocalestring
  const abbreviationFormats = [
    { val: 1e15, symbol: 'quadrillion' },
    { val: 1e12, symbol: 'trillion' },
    { val: 1e9, symbol: 'billion' },
    { val: 1e6, symbol: 'million' },
    { val: 1e3, symbol: 'thousand' },
  ];

  // Find the proper format to use
  let format;
  if (abbreviationFormats != null) {
    format = abbreviationFormats.find(f => fValue >= f.val);
  }

  // Apply format and insert symbol next to the numeric portion of the formatted string
  if (format != null) {
    const { val, symbol } = format;
    return intl.formatMessage(messages.CurrencyAbbreviations, {
      symbol,
      value: formatCurrency(fValue / val, units, { fractionDigits: 0 }),
    });
  }

  // If no format was found, format value without abbreviation
  return formatCurrency(value, units, { fractionDigits: 0 });
};

const formatUsageGb: UnitsFormatter = (value, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const formatUsageHrs: UnitsFormatter = (value, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

const unknownTypeFormatter: UnitsFormatter = (value, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
