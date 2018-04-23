import i18next from 'i18next';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

interface Props {
  locale: string;
}

const initI18n = (language: string) => {
  const languageResource = require(`../../locales/${language}.json`);
  return i18next.init({
    lng: language,
    defaultNS: 'default',
    resources: {
      en: {
        default: languageResource,
      },
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
