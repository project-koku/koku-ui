const mockedReactIntl = jest.genMockFromModule('react-intl') as any;

const intl = {
  formatDate: jest.fn(v => ''), // Dates won't match snapshots during PR builds
  formatDateTimeRange: jest.fn(v => ''), // Dates won't match snapshots during PR builds
  formatMessage: ({ defaultMessage }, params?) => {
    if (!params) {
      return defaultMessage;
    }
    return defaultMessage + JSON.stringify(params);
  },
  formatNumber: jest.fn(v => v),
};

mockedReactIntl.createIntl = () => intl;
mockedReactIntl.defineMessages = jest.fn(v => v);
mockedReactIntl.injectIntl = jest.fn(v => v);
// mockedReactIntl.injectIntl = Component => props => <Component {...props} intl={intl} />;

module.exports = mockedReactIntl;
