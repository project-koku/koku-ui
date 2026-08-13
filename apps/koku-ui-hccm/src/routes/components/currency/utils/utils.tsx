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

/**
 * The disabled code is used with exchange rates when creating a currency. For example,
 * to prevent users from selecting the same base and target currency values.
 *
 * Default enabled options provided by API (22 currencies)
 *
 * AED (AED) - United Arab Emirates Dirham
 * AUD (A$) - Australian Dollar (narrow would be "$")
 * BRL (R$) - Brazilian Real
 * CAD (CA$) - Canadian Dollar (narrow would be "$")
 * CNY (¥) - Chinese Yuan
 * CZK (Kč) - Czech Koruna
 * DKK (kr) - Danish Krone
 * EUR (€) - Euro
 * GBP (£) - British Pound
 * GHS (GH₵) - Ghanaian Cedi
 * HKD (HK$) - Hong Kong Dollar (narrow would be "$")
 * INR (₹) - Indian Rupee
 * JPY (¥) - Japanese Yen
 * NGN (₦) - Nigerian Naira
 * NOK (kr) - Norwegian Krone
 * NZD (NZ$) - New Zealand Dollar (narrow would be "$")
 * SAR (SAR) - Saudi Riyal
 * SEK (kr) - Swedish Krona
 * SGD (S$) - Singapore Dollar (narrow would be "$")
 * TWD (NT$) - New Taiwan Dollar (narrow would be "$")
 * USD ($) - United States Dollar
 * ZAR (R) - South African Rand
 */
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
