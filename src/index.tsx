import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { initApi } from 'api/api';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from 'utils/getBaseName';
import App from './app';
import { configureStore } from './store';

initApi({
  version: 'v1',
});

const store = configureStore({
  // session: {
  //   token: getToken(),
  // },
});

// tslint:disable-next-line:no-console
console.log(`basename=${getBaseName(window.location.pathname)}`);

render(
  <Provider store={store as any}>
    <NotificationsPortal />
    <Router basename={getBaseName(window.location.pathname)}>
      <App />
    </Router>
  </Provider>,

  document.getElementById('root')
);
