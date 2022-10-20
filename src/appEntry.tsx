/* eslint-disable no-console */
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { initApi } from 'api/api';
import { getLocale } from 'components/i18n';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from 'utils/paths';

// eslint-disable-next-line no-restricted-imports
import messages from '../locales/data.json';
import App from './app';
import { configureStore } from './store';

// Todo: Uncomment for use with non-shared PatternFly packages
// require.resolve('@patternfly/patternfly/patternfly.css');
require.resolve('@patternfly/patternfly/patternfly-addons.css');

import './styles/global.css';

initApi({
  version: 'v1',
});

const store = configureStore({
  // session: {
  //   token: getToken(),
  // },
});

export default () => {
  const basename = getBaseName(window.location.pathname);
  const locale = getLocale();

  return (
    <div className="cost-management">
      <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale]} onError={console.log}>
        <Provider store={store as any}>
          <NotificationsPortal />
          <Router basename={basename}>
            <App basename={basename} />
          </Router>
        </Provider>
      </IntlProvider>
    </div>
  );
};
