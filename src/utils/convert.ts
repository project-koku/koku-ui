export function toCurrency(val: number, dec: number = 2) {
  return val.toLocaleString('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}
