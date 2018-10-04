import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import React from 'react';
import { I18nextProvider, reactI18nextModule } from 'react-i18next';

interface Props {
  locale: string;
}

const initI18n = (language: string) => {
  return i18next
    .use(XHR)
    .use(reactI18nextModule)
    .init({
      backend: {
        loadPath: '/insights/platform/cost-management/locales/{{lng}}.json',
      },
      fallbackLng: 'en',
      lng: language,
      ns: ['default'],
      defaultNS: 'default',
      react: {
        wait: true,
      },
    });
};

class I18nProvider extends React.Component<Props> {
  private i18n = initI18n(this.props.locale);

  public render() {
    return (
      <I18nextProvider i18n={this.i18n}>
        <>{this.props.children}</>
      </I18nextProvider>
    );
  }
}

export { I18nProvider };
