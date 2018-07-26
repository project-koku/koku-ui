import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

const appProtocol = process.env.APP_PROTOCOL || 'http';

initApi({
  host: Boolean(process.env.APP_NAMESPACE)
    ? `${appProtocol}://koku-${
        process.env.APP_NAMESPACE
      }.1b13.insights.openshiftapps.com`
    : `${appProtocol}://localhost:8000`,
  version: 'v1',
});

const root = document.getElementById('root');
const store = configureStore({
  session: {
    token: getToken(),
  },
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
