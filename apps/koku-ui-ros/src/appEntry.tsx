/* eslint-disable no-console */
// Todo: Uncomment for use with non-shared PatternFly packages
// import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './styles/global.css';

import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { getLocale } from 'components/i18n';
import React from 'react';
import { Provider } from 'react-redux';

import messages from '../locales/data.json';
import App from './app';
import { rosStore } from './store';

const AppEntry = () => {
  const locale = getLocale();

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale]} onError={console.log}>
      <Provider store={rosStore as any}>
        <NotificationsPortal />
        <App />
      </Provider>
    </IntlProvider>
  );
};

export default AppEntry;
