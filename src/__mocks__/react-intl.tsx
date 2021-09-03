const mockedReactIntl = jest.genMockFromModule('react-intl') as any;

const intl = {
  formatMessage: ({ defaultMessage }) => defaultMessage,
};

mockedReactIntl.createIntl = () => intl;
mockedReactIntl.createIntlCache = () => undefined;
mockedReactIntl.defineMessages = jest.fn(v => v);
// mockedReactIntl.injectIntl = Component => props => <Component {...props} intl={intl} />;
mockedReactIntl.injectIntl = jest.fn(v => v);
mockedReactIntl.useIntl = () => intl;
mockedReactIntl.intl = intl;

module.exports = mockedReactIntl;
