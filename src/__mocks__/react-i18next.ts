const mockedReactI18next = jest.genMockFromModule('react-i18next') as any;

const t = jest.fn(v => v);

mockedReactI18next.I18n = jest.fn(({ children }) => children(t));
mockedReactI18next.translate = jest.fn(() => jest.fn(v => v));

module.exports = mockedReactI18next;
