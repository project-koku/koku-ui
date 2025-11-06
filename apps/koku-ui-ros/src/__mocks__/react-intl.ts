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
};

module.exports = {
  ...reactIntl,
  createIntl: () => intl,
  defineMessages: jest.fn(v => v),
  injectIntl: jest.fn(v => v),
  useIntl: () => intl,
};
