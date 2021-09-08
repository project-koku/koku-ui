const mockedReactIntl = jest.genMockFromModule('react-intl') as any;

const intl = {
  formatMessage: ({ defaultMessage }) => defaultMessage,
  formatNumber: jest.fn(v => v),
};

mockedReactIntl.createIntl = () => intl;
mockedReactIntl.defineMessages = jest.fn(v => v);
mockedReactIntl.injectIntl = jest.fn(v => v);
// mockedReactIntl.injectIntl = Component => props => <Component {...props} intl={intl} />;

module.exports = mockedReactIntl;
