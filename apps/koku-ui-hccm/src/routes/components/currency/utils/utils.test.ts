const getAccountCurrency = jest.fn();
const getCurrency = jest.fn();

jest.mock('utils/sessionStorage', () => ({
  __esModule: true,
  getAccountCurrency: (...args: any[]) => getAccountCurrency(...args),
  getCurrency: (...args: any[]) => getCurrency(...args),
}));

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: { formatMessage: (_m: unknown, values: { currency: string }) => values.currency },
}));

jest.mock('utils/format', () => ({
  __esModule: true,
  getCurrencySymbol: () => '$',
}));

import { resolveEnabledCurrency } from './utils';

describe('resolveEnabledCurrency', () => {
  beforeEach(() => {
    getAccountCurrency.mockReset();
    getCurrency.mockReset();
  });

  test('returns the session currency when it is still enabled', () => {
    getCurrency.mockReturnValue('EUR');
    getAccountCurrency.mockReturnValue('USD');

    expect(resolveEnabledCurrency(['USD', 'EUR'])).toBe('EUR');
    expect(getAccountCurrency).not.toHaveBeenCalled();
  });

  test('returns the account default when the session currency is not enabled', () => {
    getCurrency.mockReturnValue('AED');
    getAccountCurrency.mockReturnValue('USD');

    expect(resolveEnabledCurrency(['USD', 'EUR'])).toBe('USD');
  });
});
