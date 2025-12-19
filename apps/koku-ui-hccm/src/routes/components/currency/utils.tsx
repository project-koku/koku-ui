import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { getCurrencySymbol } from 'utils/format';

import type { SelectWrapperOption } from '../selectWrapper';

// Supported currencies
const currencies: {
  value: string;
}[] = [
  { value: 'AED' },
  { value: 'AUD' },
  { value: 'BRL' },
  { value: 'CAD' },
  { value: 'CHF' },
  { value: 'CNY' },
  { value: 'CZK' },
  { value: 'DKK' },
  { value: 'EUR' },
  { value: 'GBP' },
  { value: 'HKD' },
  { value: 'INR' },
  { value: 'JPY' },
  { value: 'NGN' },
  { value: 'NOK' },
  { value: 'NZD' },
  { value: 'SAR' },
  { value: 'SEK' },
  { value: 'SGD' },
  { value: 'TWD' },
  { value: 'USD' },
  { value: 'ZAR' },
];

export const getCurrencyLabel = (units: string) => {
  const currencyUnits = units || 'USD';
  return intl.formatMessage(messages.currencyOptions, {
    [currencyUnits]: getCurrencySymbol(currencyUnits),
    units: currencyUnits,
  });
};

export const getCurrencyOptions = (): SelectWrapperOption[] => {
  const currencyOptions: SelectWrapperOption[] = [];

  currencies.map(option => {
    currencyOptions.push({
      toString: () =>
        intl.formatMessage(messages.currencyOptions, {
          [option.value]: getCurrencySymbol(option.value),
          units: option.value,
        }),
      value: option.value,
    });
  });
  return currencyOptions;
};
