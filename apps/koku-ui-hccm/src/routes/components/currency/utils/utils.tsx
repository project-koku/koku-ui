import type { SettingsCurrencyData } from 'api/settings';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { getCurrencySymbol } from 'utils/format';

export const getCurrencyLabel = (units: string) => {
  const currency = units || 'USD';
  return intl.formatMessage(messages.currencyOptions, {
    currency,
    symbol: getCurrencySymbol(currency),
  });
};

// The disabled code is used with exchange rates when creating a currency. For example,
// to prevent users from selecting the same base and target currency values.
export const getCurrencyOptions = (
  currencies: SettingsCurrencyData[],
  disabledCode: string = undefined
): SelectWrapperOption[] => {
  return currencies
    ?.map(currency => ({
      isDisabled: currency.code === disabledCode,
      toString: () => getCurrencyLabel(currency.code) || currency.description,
      value: currency.code,
    }))
    .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));
};
