import { getLocale, intl } from 'components/i18n';
import messages from 'locales/messages';

export interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type Formatter = (value: number, units: string, options?: FormatOptions) => string;
export type PercentageFormatter = (value: number, options?: FormatOptions) => string;
type UnitsFormatter = (value: number, options?: FormatOptions) => string;

// Returns the number of decimals for given string
export const countDecimals = (value: string, useLocale: boolean = true) => {
  const decimalSeparator = useLocale ? Number('1.1').toLocaleString(getLocale(), {}).substring(1, 2) : '.';
  const decimals = value.split(decimalSeparator);
  return decimals[1] ? decimals[1].length : 0;
};

// Currencies are formatted differently, depending on the locale you're using. For example, the dollar
// sign may appear on the left or the right of the currency symbol for French Vs German.
//
// Using the ISO currency code AUD, $12.34 USD is formatted per the locales below.
// See ICU currencies https://www.localeplanet.com/icu/currency.html
//
// en: A$12.34
// fr: 12,34 $AU
// de: 12,34 AU$
//
// Note: Some currencies do not have decimals, such as JPY, and some have 3 decimals such as IQD.
// See https://docs.adyen.com/development-resources/currency-codes
export const formatCurrency: Formatter = (value: number, units: string, options: FormatOptions = {}) => {
  const currency = units ? units.toUpperCase() : 'USD';
  let fValue = value;

  // Don't show negative zero -- https://issues.redhat.com/browse/COST-3087
  if (!value || Number(value).toFixed(2) === '-0.00') {
    fValue = 0;
  }
  // Don't specify default fraction digits here, rely on react-intl instead
  const test = intl.formatNumber(fValue, {
    style: 'currency',
    currency,
    ...(currency === 'CZK' ? { currencyDisplay: 'narrowSymbol' } : {}),
    ...options,
  });
  return test;
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
    return intl.formatMessage(messages.currencyAbbreviations, {
      symbol,
      value: formatCurrency(fValue / val, units, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    }) as string;
  }

  // If no format was found, format value without abbreviation
  return formatCurrency(value, units, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Formats cost model rates with 0 to 10 decimals
// https://issues.redhat.com/browse/COST-1884
export const formatCurrencyRate: Formatter = (
  value: number,
  units: string,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return formatCurrency(value, units, options);
};

// Formats cost model rates with 0 to 10 decimals
// https://issues.redhat.com/browse/COST-1884
export const formatCurrencyRateRaw: Formatter = (
  value: number,
  units: string,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return formatCurrencyRaw(value, units, options);
};

// Formats without currency symbol
export const formatCurrencyRaw: Formatter = (value: number, units: string, options: FormatOptions = {}) => {
  return formatCurrency(value, units, {
    currencyDisplay: 'code',
    ...options,
  } as any)
    .toString()
    .trim()
    .replace(units, '')
    .replace(/\u202f/g, '') // Small non-breaking space for group separator
    .replace(/\xa0/g, ''); // Non-breaking space before currency
};

// Returns formatted units or currency with given currency-code
export const formatUnits: Formatter = (value, units, options) => {
  const lookup = unitsLookupKey(units);
  const fValue = value || 0;

  switch (lookup) {
    case 'byte_ms':
    case 'cluser_month':
    case 'core':
    case 'core_hours':
    case 'gb':
    case 'gb_hours':
    case 'gb_month':
    case 'gb_ms':
    case 'gib':
    case 'gib_hours':
    case 'gib_month':
    case 'gibibyte_month':
    case 'hour':
    case 'hrs':
    case 'ms':
    case 'pvc_month':
    case 'tag_month':
    case 'vm_hours':
      return formatUsage(fValue, options);
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

// Formats cost model markup with 0 to 10 decimals
// https://issues.redhat.com/browse/COST-1884
export const formatPercentageMarkup: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return value
    .toLocaleString(getLocale(), options)
    .trim()
    .replace(/\u202f/g, '') // Small non-breaking space for group separator
    .replace(/\xa0/g, ''); // Non-breaking space before currency;
};

// Format optimization metrics
export const formatOptimization: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20, // Allow the API to set the number of decimal places
  }
) => {
  const val = value.toLocaleString(getLocale(), options);
  return val;
};

export const formatUsage: UnitsFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

// Returns true if given percentage or currency format is valid for current locale
export const isCurrencyFormatValid = (value: string) => {
  const decimalSeparator = intl.formatNumber(1.1).toString().replace(/1/g, '');

  // ^[0-9] The number must start with 0-9
  // \d* The number can then have any number of any digits
  // (...)$ look at the next group from the end (...)$
  // (...)*(...)? Look for groups optionally. The first is for the comma, the second is for the decimal.
  // (,\d{3})* Look for one or more occurrences of a comma followed by three digits
  // \.\d* Look for a decimal followed by any number of any digits
  //
  // Based on https://stackoverflow.com/questions/2227370/currency-validation
  const regex = decimalSeparator === ',' ? /^-?[0-9]\d*((\.\d{3})*(,\d*)?)$/ : /^-?[0-9]\d*((,\d{3})*(\.\d*)?)$/;

  const test = regex.test(value);
  return test;
};

// Returns true if given percentage is valid for current locale
export const isPercentageFormatValid = (value: string) => {
  return isCurrencyFormatValid(value);
};

// This function normalizes a given currency or percentage.
//
// Some locales us a comma as the decimal separator (e.g., "1.234,56" in German), which must be
// replaced for APIs where USD decimal format is expected.
//
// Note that the group separator (e.g., "1,234.56" in USD) must also be removed when formatting
// currencies and percentages to display in the browser's locale.
export const unFormat = (value: string) => {
  if (!value) {
    return value;
  }

  const decimalSeparator = intl.formatNumber(1.1).toString().replace(/1/g, '');

  let rawValue = value.toString();
  if (decimalSeparator === ',') {
    rawValue = rawValue.replace(/\./g, ''); // Remove group separator
    rawValue = rawValue.replace(/,/g, '.'); // Replace decimal separator
  } else {
    rawValue = rawValue.replace(/,/g, ''); // Remove group separator
  }
  return rawValue;
};

const unknownTypeFormatter = (value: number, options: FormatOptions) => {
  return value.toLocaleString(getLocale(), options);
};

// Returns i18n key for given units
export const unitsLookupKey = (units): string => {
  const lookup = units ? units.replace(/[- ]/g, '_').toLowerCase() : '';

  switch (lookup) {
    case 'byte_ms':
    case 'cluser_month':
    case 'core':
    case 'core_hours':
    case 'gb':
    case 'gb_hours':
    case 'gb_ms':
    case 'gib':
    case 'gib_hours':
    case 'gib_month':
    case 'gibibyte_month':
    case 'hour':
    case 'hrs':
    case 'ms':
    case 'pvc_month':
    case 'vm_hours':
      return lookup;
    case 'gib_mo':
      return 'gib_month';
    case 'gb_mo':
      return 'gb_month';
    case 'tag_mo':
      return 'tag_month';
    default:
      return undefined;
  }
};
