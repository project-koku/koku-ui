import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

const appProtocol = process.env.APP_PROTOCOL || 'https';
const appNamespace = process.env.APP_NAMESPACE || 'access';
const appPort = process.env.APP_PORT || '443';
const apiEndpoint = `${appProtocol}://${appNamespace}.redhat.com:${appPort}`;
const user = process.env.DEV_USER || 'dev_user';
const password = process.env.DEV_PASSWORD || 'cccc1256utpptuvjj004jrwqclju';
const token = btoa(`${user}:${password}`);

initApi({
  host: apiEndpoint,
  version: 'v1',
  token,
});

const root = document.getElementById('root');
const store = configureStore({
  session: {
    token: getToken(),
  },
});

render(
  <Provider store={store}>
    <BrowserRouter basename="insights/platform/cost-management">
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
