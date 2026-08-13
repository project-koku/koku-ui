import { parseApiError } from './parseError';

test('parse Error object', () => {
  expect(parseApiError(Error('error message'))).toBe('error message');
});

test('parse Django error', () => {
  const axiosError = {
    response: {
      data: {
        Error: 'name is already used',
      },
    },
  };
  expect(parseApiError(axiosError)).toBe('name is already used');
});

test('parse Django errors', () => {
  const axiosError = {
    response: {
      data: {
        errors: [
          { source: 'name', detail: 'is required' },
          { source: 'markup', detail: 'must be a decimal number' },
        ],
      },
    },
  };
  expect(parseApiError(axiosError)).toBe('name: is required, markup: must be a decimal number');
});

test('parse DRF detail string', () => {
  const axiosError = {
    response: {
      data: {
        detail: 'Base currency cannot be modified. Delete and recreate the exchange rate instead.',
      },
    },
  };
  expect(parseApiError(axiosError)).toBe(
    'Base currency cannot be modified. Delete and recreate the exchange rate instead.'
  );
});

test('parse errors without source', () => {
  const axiosError = {
    response: {
      data: {
        errors: [{ detail: 'Base currency cannot be modified.' }],
      },
    },
  };
  expect(parseApiError(axiosError)).toBe('Base currency cannot be modified.');
});
