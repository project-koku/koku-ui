import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { getCurrencySymbol } from 'utils/format';

import type { SelectWrapperOption } from '../selectWrapper';

// Supported currencies
const currencies: string[] = [
  'AED',
  'AUD',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'INR',
  'JPY',
  'NGN',
  'NOK',
  'NZD',
  'SAR',
  'SEK',
  'SGD',
  'TWD',
  'USD',
  'ZAR',
];

export const getCurrencyLabel = (units: string) => {
  const currency = units || 'USD';
  return intl.formatMessage(messages.currencyOptions, {
    currency,
    symbol: getCurrencySymbol(currency),
  });
};

export const getCurrencyOptions = (): SelectWrapperOption[] => {
  return currencies.map(currency => ({
    toString: () => getCurrencyLabel(currency),
    value: currency,
  }));
};
