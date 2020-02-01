import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import React from 'react';
import { I18nextProvider, reactI18nextModule } from 'react-i18next';

const appPublicPath =
  process.env.APP_PUBLIC_PATH || '/insights/platform/cost-management';

interface Props {
  locale: string;
}

const initI18n = (language: string) => {
  return i18next
    .use(XHR)
    .use(reactI18nextModule)
    .init({
      backend: {
        loadPath: `${appPublicPath}/locales/{{lng}}.json`,
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
      <I18nextProvider i18n={this.i18n as any}>
        <>{this.props.children}</>
      </I18nextProvider>
    );
  }
}

export { I18nProvider };
