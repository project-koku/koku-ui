// import i18next from 'i18next';
// import XHR from 'i18next-xhr-backend';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages_en from '../../locales/en.json';

// react-intl does not support nested json, so we need to flatten it
const flattenMessages = (nestedMessages: any, prefix = '') => {
  if (nestedMessages === null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};
const globalIntlCache = createIntlCache();
const intl = createIntl(
  {
    locale: 'en',
    messages: flattenMessages(messages_en),
  },
  globalIntlCache
);
const t = (id: string, value?: any) => intl.formatMessage({ id }, value);

// const appPublicPath =
//   process.env.APP_PUBLIC_PATH || '/insights/platform/cost-management';

interface Props {
  locale: string;
}

// const initI18n = (language: string) => {
//   return i18next
//     .use(XHR)
//     .use(reactI18nextModule)
//     .init({
//       backend: {
//         loadPath: `${appPublicPath}/locales/{{lng}}.json`,
//       },
//       fallbackLng: 'en',
//       lng: language,
//       ns: ['default'],
//       defaultNS: 'default',
//       react: {
//         wait: true,
//       },
//     });
// };

class I18nProvider extends React.Component<Props> {
  // private i18n = initI18n(this.props.locale);

  public render() {
    return (
      // <I18nextProvider i18n={this.i18n as any}>
      //   <>{this.props.children}</>
      // </I18nextProvider>
      <RawIntlProvider value={intl}>
        <>{this.props.children}</>
      </RawIntlProvider>
    );
  }
}

export { I18nProvider, globalIntlCache, intl, t };
