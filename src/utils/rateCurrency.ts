export function formatCurrency(rate: number): string {
  const rateStr = String(rate);
  const [n, d] = rateStr.split('.');
  if (d === undefined) {
    return `${n}.00`;
  }
  if (d.length === 1) {
    return `${n}.${d}0`;
  }
  return rateStr;
}
