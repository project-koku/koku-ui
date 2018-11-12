export interface FormatOptions {
  fractionDigits?: number;
  translateFunction?(text: string): string;
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
  const fValue = value || 0;

  switch (lookup) {
    case 'usd':
      return formatCurrency(fValue, lookup, options);
    case 'hrs':
    case 'gb':
      return unknownTypeFormatter(fValue, lookup, {
        fractionDigits: 2,
        ...options,
      });
    default:
      return unknownTypeFormatter(fValue, null, options);
  }
};

export const unknownTypeFormatter: ValueFormatter = (
  value,
  _unit,
  { fractionDigits, translateFunction } = {}
) => {
  const fixedVal = value.toFixed(fractionDigits);
  return _unit
    ? `${fixedVal} ${translateFunction ? translateFunction(_unit) : _unit}`
    : `${fixedVal}`;
};

export const formatCurrency: ValueFormatter = (
  value,
  _unit,
  { fractionDigits = 2 } = {}
) => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  return fValue.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
