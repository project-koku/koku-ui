export interface FormatOptions {
  fractionDigits?: number;
}

export type ValueFormatter = (
  value: number,
  unit?: string,
  options?: FormatOptions
) => string | number;

export const unitLookupKey = unit => {
  const lookup = unit ? unit.toLowerCase() : '';
  switch (lookup) {
    case 'usd':
    case 'gb':
    case 'gb-hours':
    case 'gb-mo':
    case 'core-hours':
    case 'hrs':
    case 'tag-mo':
      return lookup;
    default:
      return '';
  }
};

export const formatValue: ValueFormatter = (
  value: number,
  unit: string,
  options: FormatOptions = {}
) => {
  const lookup = unitLookupKey(unit);
  const fValue = value || 0;

  switch (lookup) {
    case 'usd':
      return formatCurrency(fValue, lookup, options);
    case 'gb':
    case 'gb-hours':
    case 'gb-mo':
    case 'tag-mo':
      return formatUsageGb(fValue, lookup, options);
    case 'core-hours':
    case 'hrs':
      return formatUsageHrs(fValue, lookup, options);
    default:
      return unknownTypeFormatter(fValue, lookup, options);
  }
};

const unknownTypeFormatter: ValueFormatter = (
  value,
  _unit,
  { fractionDigits } = {}
) => {
  return value.toFixed(fractionDigits);
};

export const formatCurrency: ValueFormatter = (
  value,
  unit,
  { fractionDigits = 2 } = {}
) => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  return fValue.toLocaleString('en', {
    style: 'currency',
    currency: unit || 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatUsageGb: ValueFormatter = (
  value,
  _unit,
  { fractionDigits = 2 } = {}
) => {
  return value.toFixed(fractionDigits);
};

export const formatUsageHrs: ValueFormatter = (
  value,
  _unit,
  { fractionDigits } = {}
) => {
  return value.toFixed(fractionDigits);
};
