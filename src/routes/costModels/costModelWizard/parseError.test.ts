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
