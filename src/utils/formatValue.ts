import { getLocale, intl } from 'components/i18n';
import messages from 'locales/messages';

export interface FormatOptions {
  fractionDigits?: number;
}

export type ValueFormatter = (value: number, unit?: string, options?: FormatOptions) => string | number;

export const unitLookupKey = units => {
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
      break;
    default:
      return '';
  }
};

export const formatValue: ValueFormatter = (value: number, units: string, options: FormatOptions = {}) => {
  const lookup = unitLookupKey(units);
  const fValue = value || 0;

  switch (lookup) {
    case 'coreHours':
    case 'hour':
    case 'hrs':
      return formatUsageHrs(fValue, lookup, options);
    case 'gb':
    case 'gb_hours':
    case 'gb_mo':
    case 'gibibyte_month':
    case 'tag_mo':
    case 'vm_hours':
      return formatUsageGb(fValue, lookup, options);
  }

  // Format currency
  if (units && units.length === 3) {
    return formatCurrency(fValue, units, options);
  }
  return unknownTypeFormatter(fValue, lookup);
};

const unknownTypeFormatter: ValueFormatter = (value, _unit, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

// Some currencies do not have decimals, such as JPY, and some have 3 decimals such as IQD.
export const formatCurrency: ValueFormatter = (value, units = 'USD') => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  return intl.formatNumber(fValue, { style: 'currency', currency: units.toUpperCase() });

  /*
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  return fValue.toLocaleString(getLocale(), {
    style: 'currency',
    currency: 'GBP', // unit || 'USD',
    // minimumFractionDigits: fractionDigits,
    // maximumFractionDigits: fractionDigits,
  });
  */
};

export const formatCurrencyAbbreviation: ValueFormatter = (value, units = 'USD', { fractionDigits = 2 } = {}) => {
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
    const formatted = (fValue / val).toLocaleString(getLocale(), {
      style: 'currency',
      currency: units,
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    });
    const parts = formatted.match(/([\D]*)([\d.,]+)([\D]*)/);
    const abbr = intl.formatMessage(messages.CurrencyAbbreviations, { value: symbol });
    return `${parts[1]}${parts[2]}${abbr}${parts[3]}`;
  }

  // If no format was found, format value without abbreviation
  return fValue.toLocaleString(getLocale(), {
    style: 'currency',
    currency: units,
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatUsageGb: ValueFormatter = (value, _units, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatUsageHrs: ValueFormatter = (value, _units, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
