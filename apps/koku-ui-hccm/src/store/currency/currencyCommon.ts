import type { CurrencyType } from 'api/currency';

export const currencyStateKey = 'currency';

export function getFetchId(currencyType: CurrencyType, currencyQueryString: string = '') {
  return `${currencyType}--${currencyQueryString}`;
}
