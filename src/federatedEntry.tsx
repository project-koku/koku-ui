import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { initApi } from 'api/api';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from 'utils/getBaseName';

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

export default () => (
  <Provider store={store as any}>
    <NotificationsPortal />
    <Router basename={getBaseName(window.location.pathname)}>
      <App />
    </Router>
  </Provider>
);
