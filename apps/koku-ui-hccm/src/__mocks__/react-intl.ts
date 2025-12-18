const reactIntl = jest.requireActual('react-intl');

const intl = {
  formatDate: jest.fn(() => ''), // Dates won't match snapshots during PR builds
  formatDateTimeRange: jest.fn(() => ''), // Dates won't match snapshots during PR builds
  formatMessage: jest.fn(({ defaultMessage }, params?) => {
    if (!params) {
      return defaultMessage;
    }
    return defaultMessage + JSON.stringify(params);
  }),
  formatNumber: jest.fn(v => v),
  // Used by getCurrencySymbol; mimic Intl.NumberFormat(...).formatToParts
  formatNumberToParts: jest.fn((value: number, options?: any) => {
    try {
      return new Intl.NumberFormat('en', options).formatToParts(value);
    } catch {
      // Fallback minimal shape if environment lacks formatToParts for given options
      const currency = options?.currency || '';
      // Basic symbol map for common currencies used in tests
      const symbolMap: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'CA$',
        AUD: 'A$',
        SGD: 'S$',
      };
      const symbol = symbolMap[currency] || currency;
      return [{ type: 'currency', value: symbol }];
    }
  }),
};

module.exports = {
  ...reactIntl,
  createIntl: () => intl,
  defineMessages: jest.fn(v => v),
  injectIntl: jest.fn(v => v),
  useIntl: () => intl,
};
