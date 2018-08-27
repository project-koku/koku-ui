export interface FormatOptions {
  fractionDigits?: number;
}

export type ValueFormatter = (
  value: number,
  unit?: string,
  options?: FormatOptions
) => string | number;

export const formatValue: ValueFormatter = (
  value: number,
  unit: string,
  options: FormatOptions = {}
) => {
  const lookup = unit && unit.split('-')[0].toLowerCase();

  switch (lookup) {
    case 'usd':
      return formatCurrency(value, lookup, options);
    case 'gb':
      return formatStorage(value, lookup, options);
    default:
      return unknownTypeFormatter(value, lookup, options);
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
  _unit,
  { fractionDigits = 2 } = {}
) => {
  return value.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatStorage: ValueFormatter = (
  value,
  _unit,
  { fractionDigits = 2 } = {}
) => {
  return value.toFixed(fractionDigits);
};
