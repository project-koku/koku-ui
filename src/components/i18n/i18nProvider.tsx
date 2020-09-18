import { i18nInit } from 'components/i18n';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

interface Props {
  locale: string;
}

class I18nProvider extends React.Component<Props> {
  public render() {
    i18nInit.changeLanguage(this.props.locale);

    return (
      <I18nextProvider i18n={i18nInit}>
        <>{this.props.children}</>
      </I18nextProvider>
    );
  }
}

export { I18nProvider };
