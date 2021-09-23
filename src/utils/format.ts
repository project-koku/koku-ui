import { getLocale, intl } from 'components/i18n';
import messages from 'locales/messages';

export interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type Formatter = (value: number, units: string, options?: FormatOptions) => string | number;
export type PercentageFormatter = (value: number, options?: FormatOptions) => string | number;
type UnitsFormatter = (value: number, options?: FormatOptions) => string | number;

// Returns i18n key for given units
export const unitsLookupKey = (units): string => {
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

// Some currencies do not have decimals, such as JPY, and some have 3 decimals such as IQD.
// See https://docs.adyen.com/development-resources/currency-codes
export const formatCurrency: Formatter = (value: number, units: string, options: FormatOptions = {}): string => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  // Don't specify default fraction digits here, rely on react-intl instead
  return intl.formatNumber(fValue, {
    style: 'currency',
    currency: units ? units.toUpperCase() : 'USD',
    ...options,
  });
};

export const formatCurrencyAbbreviation: Formatter = (value, units = 'USD') => {
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
      value: formatCurrency(fValue / val, units, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    });
  }

  // If no format was found, format value without abbreviation
  return formatCurrency(value, units, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Returns formatted units or currency with given currency-code
export const formatUnits: Formatter = (value, units, options) => {
  const lookup = unitsLookupKey(units);
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
  return unknownTypeFormatter(fValue, options);
};

export const formatPercentage: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

const formatUsageGb: UnitsFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

const formatUsageHrs: UnitsFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

const unknownTypeFormatter = (value, options) => {
  return value.toLocaleString(getLocale(), options);
};
