/* eslint-disable no-console */
// Todo: Uncomment for use with non-shared PatternFly packages
// import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './styles/global.css';

import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { getLocale } from 'components/i18n';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

// eslint-disable-next-line no-restricted-imports
import messages from '../locales/data.json';
import App from './app';
import { configureStore } from './store';

const costStore = configureStore({
  // session: {
  //   token: getToken(),
  // },
});

const AppEntry = () => {
  const locale = getLocale();

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale] || messages.en} onError={console.log}>
      <Provider store={costStore as any}>
        <NotificationsPortal />
        <App />
      </Provider>
    </IntlProvider>
  );
};

export default AppEntry;
