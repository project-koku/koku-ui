import { formatCurrency } from './rateCurrency';

test('format xy', () => {
  expect(formatCurrency(10)).toBe('10.00');
});

test('format xy.z', () => {
  expect(formatCurrency(10.1)).toBe('10.10');
});

test('format xy.zw', () => {
  expect(formatCurrency(10.12)).toBe('10.12');
});
