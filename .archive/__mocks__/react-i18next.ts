const mockedReactI18next = jest.genMockFromModule('react-i18next') as any;

const t = jest.fn(v => v);
const i18n = {
  changeLanguage: () => new Promise(() => {}),
};

mockedReactI18next.I18n = jest.fn(({ children }) => children(t));
mockedReactI18next.withTranslation = () => Component => {
  Component.defaultProps = { ...Component.defaultProps, t: (v: string) => v };
  return Component;
};
mockedReactI18next.useTranslation = jest.fn(() => ({ t, i18n }));

module.exports = mockedReactI18next;
